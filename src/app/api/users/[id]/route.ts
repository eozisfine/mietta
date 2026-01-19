import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { validateSession } from '@/lib/auth';

// GET - Singolo utente
export async function GET(
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

    const result = await db.execute({
      sql: `SELECT id, email, role, enabled, last_login, created_at FROM users WHERE id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Errore' }, { status: 500 });
  }
}

// PATCH - Aggiorna utente (abilita/disabilita)
export async function PATCH(
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

    const body = await request.json();
    const updates: string[] = [];
    const args: any[] = [];

    if (typeof body.enabled === 'boolean') {
      updates.push('enabled = ?');
      args.push(body.enabled ? 1 : 0);
    }

    if (body.role) {
      updates.push('role = ?');
      args.push(body.role);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 });
    }

    updates.push("updated_at = datetime('now')");
    args.push(id);

    await db.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      args,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Errore' }, { status: 500 });
  }
}

// DELETE - Elimina utente
export async function DELETE(
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

    // Non permettere di eliminare se stessi
    if (currentUser.userId === Number(id)) {
      return NextResponse.json({ error: 'Non puoi eliminare il tuo account' }, { status: 400 });
    }

    // Elimina sessioni dell'utente
    await db.execute({
      sql: `DELETE FROM sessions WHERE user_id = ?`,
      args: [id],
    });

    // Elimina utente
    await db.execute({
      sql: `DELETE FROM users WHERE id = ?`,
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Errore' }, { status: 500 });
  }
}
