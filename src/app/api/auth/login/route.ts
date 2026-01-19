import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await initDb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e password sono obbligatori' },
        { status: 400 }
      );
    }

    // Cerca utente
    const result = await db.execute({
      sql: `SELECT id, email, password_hash, role, enabled FROM users WHERE email = ?`,
      args: [email.toLowerCase()],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verifica se utente abilitato
    if (!user.enabled) {
      return NextResponse.json(
        { error: 'Account disabilitato' },
        { status: 401 }
      );
    }

    // Verifica password
    const isValid = await verifyPassword(password, user.password_hash as string);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    // Crea sessione
    const token = await createSession(user.id as number);

    // Aggiorna last_login
    await db.execute({
      sql: `UPDATE users SET last_login = datetime('now') WHERE id = ?`,
      args: [user.id],
    });

    // Imposta cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 giorni
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Errore durante il login' },
      { status: 500 }
    );
  }
}
