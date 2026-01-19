import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// GET - Lista menu items
export async function GET() {
  try {
    await initDb();
    const result = await db.execute(`
      SELECT * FROM menu_items
      ORDER BY parent_id NULLS FIRST, order_index ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Errore nel recupero menu' }, { status: 500 });
  }
}

// POST - Crea nuovo menu item
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();
    const { label, href, parent_id, order_index, visible, open_in_new_tab, is_dynamic_dropdown, dropdown_source } = body;

    if (!label) {
      return NextResponse.json({ error: 'Label è obbligatorio' }, { status: 400 });
    }

    if (!is_dynamic_dropdown && !href) {
      return NextResponse.json({ error: 'Href è obbligatorio per voci non dropdown' }, { status: 400 });
    }

    const result = await db.execute({
      sql: `INSERT INTO menu_items (label, href, parent_id, order_index, visible, open_in_new_tab, is_dynamic_dropdown, dropdown_source)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [label, href || '#', parent_id || null, order_index || 0, visible ?? 1, open_in_new_tab ?? 0,
             is_dynamic_dropdown ? 1 : 0, dropdown_source || null]
    });

    return NextResponse.json({ id: Number(result.lastInsertRowid), message: 'Menu item creato' });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Errore nella creazione' }, { status: 500 });
  }
}
