import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { validateSession, generateResetToken } from '@/lib/auth';

// POST - Genera token reset password
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const currentUser = await validateSession(token);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // Verifica che l'utente esista
    const userResult = await db.execute({
      sql: `SELECT id, email FROM users WHERE id = ?`,
      args: [id],
    });

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    // Genera token reset (valido 24 ore)
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.execute({
      sql: `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?`,
      args: [resetToken, expiresAt.toISOString(), id],
    });

    // In produzione qui invieresti l'email
    // Per ora restituiamo il token per test
    return NextResponse.json({
      success: true,
      resetToken,
      resetUrl: `/admin/reset-password?token=${resetToken}`,
      message: 'Token reset generato. In produzione verrà inviato via email.',
    });
  } catch (error) {
    console.error('Error generating reset token:', error);
    return NextResponse.json({ error: 'Errore' }, { status: 500 });
  }
}
