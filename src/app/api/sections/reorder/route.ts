import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST - Riordina le sezioni di una pagina
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections }: { sections: { id: number; order_index: number }[] } = body;

    // Aggiorna l'ordine di tutte le sezioni
    for (const section of sections) {
      await db.execute({
        sql: 'UPDATE page_sections SET order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        args: [section.order_index, section.id],
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering sections:', error);
    return NextResponse.json({ error: 'Failed to reorder sections' }, { status: 500 });
  }
}
