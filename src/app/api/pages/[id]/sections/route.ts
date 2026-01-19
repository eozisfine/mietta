import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CreatePageSectionSchema } from '@/types/section';

// GET - Recupera tutte le sezioni di una pagina
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.execute({
      sql: 'SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC',
      args: [id],
    });
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST - Crea una nuova sezione per una pagina
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = CreatePageSectionSchema.parse({ ...body, page_id: Number(id) });

    const result = await db.execute({
      sql: `INSERT INTO page_sections (page_id, section_type, title, text, image, image_mobile, href, button_text, order_index, animation, animation_delay)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        validatedData.page_id,
        validatedData.section_type,
        validatedData.title || null,
        validatedData.text || null,
        validatedData.image || null,
        validatedData.image_mobile || null,
        validatedData.href || null,
        (body as any).button_text || null,
        validatedData.order_index,
        validatedData.animation,
        validatedData.animation_delay,
      ],
    });

    return NextResponse.json({ id: result.lastInsertRowid, ...validatedData }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
