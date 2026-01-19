import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// POST - Incrementa contatore hits per un redirect
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { source_path } = body;

    if (!source_path) {
      return NextResponse.json({ error: 'source_path richiesto' }, { status: 400 });
    }

    await db.execute({
      sql: `UPDATE redirects SET hits = hits + 1 WHERE source_path = ?`,
      args: [source_path]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing redirect hits:', error);
    return NextResponse.json({ error: 'Errore nell\'aggiornamento' }, { status: 500 });
  }
}
