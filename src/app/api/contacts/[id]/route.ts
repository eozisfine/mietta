import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Singolo messaggio
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    const result = await db.execute({
      sql: `SELECT * FROM contact_messages WHERE id = ?`,
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Messaggio non trovato' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ error: 'Errore nel recupero' }, { status: 500 });
  }
}

// PATCH - Aggiorna stato messaggio (read, archived, replied, notes)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();

    const updates: string[] = [];
    const args: any[] = [];

    if (body.read !== undefined) {
      updates.push('read = ?');
      args.push(body.read ? 1 : 0);
    }
    if (body.archived !== undefined) {
      updates.push('archived = ?');
      args.push(body.archived ? 1 : 0);
    }
    if (body.replied !== undefined) {
      updates.push('replied = ?');
      args.push(body.replied ? 1 : 0);
    }
    if (body.notes !== undefined) {
      updates.push('notes = ?');
      args.push(body.notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Nessun campo da aggiornare' }, { status: 400 });
    }

    args.push(id);

    await db.execute({
      sql: `UPDATE contact_messages SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({ message: 'Messaggio aggiornato' });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json({ error: 'Errore aggiornamento' }, { status: 500 });
  }
}

// DELETE - Elimina messaggio
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    await db.execute({
      sql: `DELETE FROM contact_messages WHERE id = ?`,
      args: [id]
    });

    return NextResponse.json({ message: 'Messaggio eliminato' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Errore eliminazione' }, { status: 500 });
  }
}
