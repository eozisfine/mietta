import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdatePageSchema } from '@/types/section';

// GET - Recupera una pagina specifica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.execute({
      sql: 'SELECT * FROM pages WHERE id = ?',
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT - Aggiorna una pagina
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Campi consentiti per l'aggiornamento
    const allowedFields = [
      'slug', 'title', 'description', 'category', 'cover_image',
      'published', 'published_at', 'seo_title', 'seo_description',
      'seo_keywords', 'seo_og_image', 'seo_no_index'
    ];

    allowedFields.forEach((key) => {
      if (body[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        if (key === 'published' || key === 'seo_no_index') {
          updateValues.push(body[key] ? 1 : 0);
        } else {
          updateValues.push(body[key] || null);
        }
      }
    });

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(id);

    await db.execute({
      sql: `UPDATE pages SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: updateValues,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE - Elimina una pagina (e tutte le sue sezioni)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.execute({
      sql: 'DELETE FROM pages WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
