import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { hashPassword, validateSession } from '@/lib/auth';

// GET - Lista utenti
export async function GET(request: NextRequest) {
  try {
    await initDb();

    // Verifica autenticazione
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const user = await validateSession(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const result = await db.execute(`
      SELECT id, email, role, enabled, last_login, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Errore nel caricamento utenti' }, { status: 500 });
  }
}

// POST - Crea nuovo utente
export async function POST(request: NextRequest) {
  try {
    await initDb();

    // Verifica autenticazione
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const currentUser = await validateSession(token);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { email, password, role = 'admin' } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password sono obbligatori' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'La password deve avere almeno 8 caratteri' }, { status: 400 });
    }

    // Verifica email duplicata
    const existing = await db.execute({
      sql: `SELECT id FROM users WHERE email = ?`,
      args: [email.toLowerCase()],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email già registrata' }, { status: 400 });
    }

    // Crea utente
    const passwordHash = await hashPassword(password);

    const result = await db.execute({
      sql: `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
      args: [email.toLowerCase(), passwordHash, role],
    });

    return NextResponse.json({
      id: Number(result.lastInsertRowid),
      email: email.toLowerCase(),
      role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Errore nella creazione utente' }, { status: 500 });
  }
}
