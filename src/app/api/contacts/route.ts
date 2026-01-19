import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Lista messaggi contatto
export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const archived = searchParams.get('archived') === 'true';
    const unreadOnly = searchParams.get('unread') === 'true';

    let sql = `SELECT * FROM contact_messages WHERE archived = ?`;
    const args: any[] = [archived ? 1 : 0];

    if (unreadOnly) {
      sql += ` AND read = 0`;
    }

    sql += ` ORDER BY created_at DESC`;

    const result = await db.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Errore nel recupero messaggi' }, { status: 500 });
  }
}

// POST - Crea nuovo messaggio (per form pubblico)
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nome, email e messaggio sono obbligatori' }, { status: 400 });
    }

    // Validazione email base
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 });
    }

    const result = await db.execute({
      sql: `INSERT INTO contact_messages (name, email, phone, subject, message)
            VALUES (?, ?, ?, ?, ?)`,
      args: [name, email, phone || null, subject || null, message]
    });

    return NextResponse.json({ id: Number(result.lastInsertRowid), message: 'Messaggio inviato' });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ error: 'Errore invio messaggio' }, { status: 500 });
  }
}
