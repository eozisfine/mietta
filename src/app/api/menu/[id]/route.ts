import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// PUT - Aggiorna menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;
    const body = await request.json();
    const { label, href, parent_id, order_index, visible, open_in_new_tab, is_dynamic_dropdown, dropdown_source } = body;

    await db.execute({
      sql: `UPDATE menu_items
            SET label = ?, href = ?, parent_id = ?, order_index = ?, visible = ?, open_in_new_tab = ?,
                is_dynamic_dropdown = ?, dropdown_source = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [label, href, parent_id || null, order_index, visible ? 1 : 0, open_in_new_tab ? 1 : 0,
             is_dynamic_dropdown ? 1 : 0, dropdown_source || null, id]
    });

    return NextResponse.json({ message: 'Menu item aggiornato' });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Errore aggiornamento' }, { status: 500 });
  }
}

// DELETE - Elimina menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    // Elimina anche i figli
    await db.execute({
      sql: `DELETE FROM menu_items WHERE id = ? OR parent_id = ?`,
      args: [id, id]
    });

    return NextResponse.json({ message: 'Menu item eliminato' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Errore eliminazione' }, { status: 500 });
  }
}
