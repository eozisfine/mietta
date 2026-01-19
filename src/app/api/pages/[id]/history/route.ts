import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Recupera storico modifiche di una pagina
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await db.execute({
      sql: `SELECT * FROM page_history WHERE page_id = ? ORDER BY created_at DESC LIMIT 100`,
      args: [id],
    });

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching page history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

// POST - Aggiunge una entry allo storico
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { action, entity_type, entity_id, description, old_data, new_data } = body;

  try {
    await db.execute({
      sql: `INSERT INTO page_history (page_id, action, entity_type, entity_id, description, old_data, new_data)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        action,
        entity_type,
        entity_id || null,
        description || null,
        old_data ? JSON.stringify(old_data) : null,
        new_data ? JSON.stringify(new_data) : null,
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}
