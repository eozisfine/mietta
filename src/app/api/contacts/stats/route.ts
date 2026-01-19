import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Statistiche messaggi
export async function GET() {
  try {
    await initDb();

    const [total, unread, archived] = await Promise.all([
      db.execute(`SELECT COUNT(*) as count FROM contact_messages WHERE archived = 0`),
      db.execute(`SELECT COUNT(*) as count FROM contact_messages WHERE read = 0 AND archived = 0`),
      db.execute(`SELECT COUNT(*) as count FROM contact_messages WHERE archived = 1`)
    ]);

    return NextResponse.json({
      total: total.rows[0]?.count || 0,
      unread: unread.rows[0]?.count || 0,
      archived: archived.rows[0]?.count || 0
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    return NextResponse.json({ error: 'Errore statistiche' }, { status: 500 });
  }
}
