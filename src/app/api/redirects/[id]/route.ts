import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// PUT - Aggiorna redirect
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();
    const { source_path, destination_path, redirect_type, enabled } = body;

    const normalizedSource = source_path.startsWith('/') ? source_path : '/' + source_path;
    const normalizedDest = destination_path.startsWith('/') || destination_path.startsWith('http')
      ? destination_path
      : '/' + destination_path;

    // Verifica duplicati (escluso se stesso)
    const existing = await db.execute({
      sql: `SELECT id FROM redirects WHERE source_path = ? AND id != ?`,
      args: [normalizedSource, id]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Redirect per questo percorso già esistente' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE redirects
            SET source_path = ?, destination_path = ?, redirect_type = ?, enabled = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [normalizedSource, normalizedDest, redirect_type || 301, enabled ? 1 : 0, id]
    });

    return NextResponse.json({ message: 'Redirect aggiornato' });
  } catch (error) {
    console.error('Error updating redirect:', error);
    return NextResponse.json({ error: 'Errore aggiornamento' }, { status: 500 });
  }
}

// DELETE - Elimina redirect
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    await db.execute({
      sql: `DELETE FROM redirects WHERE id = ?`,
      args: [id]
    });

    return NextResponse.json({ message: 'Redirect eliminato' });
  } catch (error) {
    console.error('Error deleting redirect:', error);
    return NextResponse.json({ error: 'Errore eliminazione' }, { status: 500 });
  }
}
