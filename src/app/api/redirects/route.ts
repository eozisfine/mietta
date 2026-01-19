import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Lista redirect
export async function GET() {
  try {
    await initDb();
    const result = await db.execute(`SELECT * FROM redirects ORDER BY source_path ASC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return NextResponse.json({ error: 'Errore nel recupero redirect' }, { status: 500 });
  }
}

// POST - Crea nuovo redirect
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { source_path, destination_path, redirect_type, enabled } = body;

    if (!source_path || !destination_path) {
      return NextResponse.json({ error: 'Source e destination sono obbligatori' }, { status: 400 });
    }

    // Verifica che source inizi con /
    const normalizedSource = source_path.startsWith('/') ? source_path : '/' + source_path;
    const normalizedDest = destination_path.startsWith('/') || destination_path.startsWith('http')
      ? destination_path
      : '/' + destination_path;

    // Verifica duplicati
    const existing = await db.execute({
      sql: `SELECT id FROM redirects WHERE source_path = ?`,
      args: [normalizedSource]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Redirect per questo percorso già esistente' }, { status: 400 });
    }

    const result = await db.execute({
      sql: `INSERT INTO redirects (source_path, destination_path, redirect_type, enabled)
            VALUES (?, ?, ?, ?)`,
      args: [normalizedSource, normalizedDest, redirect_type || 301, enabled ?? 1]
    });

    return NextResponse.json({ id: Number(result.lastInsertRowid), message: 'Redirect creato' });
  } catch (error) {
    console.error('Error creating redirect:', error);
    return NextResponse.json({ error: 'Errore nella creazione' }, { status: 500 });
  }
}
