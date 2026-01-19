import { NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// POST - Popola il menu con le voci iniziali (esegui una sola volta)
export async function POST() {
  try {
    await initDb();

    // Verifica se il menu è già popolato
    const existing = await db.execute(`SELECT COUNT(*) as count FROM menu_items`);
    if ((existing.rows[0] as any).count > 0) {
      return NextResponse.json({
        message: 'Menu già popolato',
        count: (existing.rows[0] as any).count
      });
    }

    // Voci di menu principali basate sul sito attuale
    // Struttura: 3 link PRIMA di Eventi, dropdown Eventi dinamico, 2 link DOPO
    const menuItems = [
      { label: 'Filosofia', href: '/filosofia', order_index: 0, is_dynamic_dropdown: false, dropdown_source: null },
      { label: 'Progetti', href: '/progetti', order_index: 1, is_dynamic_dropdown: false, dropdown_source: null },
      { label: 'Trasforma la tua casa', href: '/trasforma-la-tua-casa', order_index: 2, is_dynamic_dropdown: false, dropdown_source: null },
      { label: 'Eventi', href: '#', order_index: 3, is_dynamic_dropdown: true, dropdown_source: 'eventi' }, // Dropdown dinamico
      { label: 'Store Vignola', href: '/store-vignola', order_index: 4, is_dynamic_dropdown: false, dropdown_source: null },
      { label: 'Contatti', href: '/contatti', order_index: 5, is_dynamic_dropdown: false, dropdown_source: null },
    ];

    for (const item of menuItems) {
      await db.execute({
        sql: `INSERT INTO menu_items (label, href, parent_id, order_index, visible, open_in_new_tab, is_dynamic_dropdown, dropdown_source)
              VALUES (?, ?, NULL, ?, 1, 0, ?, ?)`,
        args: [item.label, item.href, item.order_index, item.is_dynamic_dropdown ? 1 : 0, item.dropdown_source]
      });
    }

    return NextResponse.json({
      message: 'Menu popolato con successo',
      items: menuItems.length
    });
  } catch (error) {
    console.error('Error seeding menu:', error);
    return NextResponse.json({ error: 'Errore nel popolamento menu' }, { status: 500 });
  }
}

// GET - Verifica stato del menu
export async function GET() {
  try {
    await initDb();
    const result = await db.execute(`SELECT * FROM menu_items ORDER BY order_index`);
    return NextResponse.json({
      count: result.rows.length,
      items: result.rows
    });
  } catch (error) {
    console.error('Error checking menu:', error);
    return NextResponse.json({ error: 'Errore nel controllo menu' }, { status: 500 });
  }
}
