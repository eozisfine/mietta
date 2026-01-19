import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import {
  CreatePageSchema,
  CreatePageSectionSchema,
  UpdatePageSchema
} from '@/types/section';

// GET - Recupera tutte le sezioni ordinate
export async function GET() {
  try {
    await initDb();
    const result = await db.execute('SELECT * FROM sections ORDER BY order_index ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST - Crea una nuova sezione
export async function POST(request: NextRequest) {

  try {
    await initDb();
    const body = await request.json();
    const validatedData = CreatePageSectionSchema.parse(body);

    const result = await db.execute({
      sql: `INSERT INTO sections (section_type, title, text, image, order_index, animation, animation_delay)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        validatedData.section_type,
        validatedData.title || null,
        validatedData.text || null,
        validatedData.image || null,
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
