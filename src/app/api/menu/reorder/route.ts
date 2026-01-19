import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// POST - Riordina menu items
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { items } = body; // Array di { id, order_index, parent_id }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items deve essere un array' }, { status: 400 });
    }

    for (const item of items) {
      await db.execute({
        sql: `UPDATE menu_items SET order_index = ?, parent_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        args: [item.order_index, item.parent_id || null, item.id]
      });
    }

    return NextResponse.json({ message: 'Menu riordinato' });
  } catch (error) {
    console.error('Error reordering menu:', error);
    return NextResponse.json({ error: 'Errore riordinamento' }, { status: 500 });
  }
}
