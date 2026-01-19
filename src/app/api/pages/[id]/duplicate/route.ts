import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

// POST - Duplica una pagina con tutte le sue sezioni
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    // Recupera la pagina originale
    const pageResult = await db.execute({
      sql: `SELECT * FROM pages WHERE id = ?`,
      args: [id]
    });

    if (pageResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pagina non trovata' }, { status: 404 });
    }

    const originalPage = pageResult.rows[0] as any;

    // Genera nuovo slug univoco
    let newSlug = `${originalPage.slug}-copia`;
    let counter = 1;

    while (true) {
      const existing = await db.execute({
        sql: `SELECT id FROM pages WHERE slug = ?`,
        args: [newSlug]
      });

      if (existing.rows.length === 0) break;

      counter++;
      newSlug = `${originalPage.slug}-copia-${counter}`;
    }

    // Crea la nuova pagina
    const newPageResult = await db.execute({
      sql: `INSERT INTO pages (
              slug, title, description, category, cover_image, published,
              seo_title, seo_description, seo_keywords, seo_og_image, seo_no_index
            ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
      args: [
        newSlug,
        `${originalPage.title} (Copia)`,
        originalPage.description,
        originalPage.category,
        originalPage.cover_image,
        originalPage.seo_title,
        originalPage.seo_description,
        originalPage.seo_keywords,
        originalPage.seo_og_image,
        originalPage.seo_no_index || 0
      ]
    });

    const newPageId = Number(newPageResult.lastInsertRowid);

    // Duplica le sezioni
    const sectionsResult = await db.execute({
      sql: `SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index`,
      args: [id]
    });

    for (const section of sectionsResult.rows as any[]) {
      await db.execute({
        sql: `INSERT INTO page_sections (
                page_id, section_type, title, text, image, image_mobile, href,
                order_index, animation, animation_delay
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          newPageId,
          section.section_type,
          section.title,
          section.text,
          section.image,
          section.image_mobile,
          section.href,
          section.order_index,
          section.animation,
          section.animation_delay
        ]
      });
    }

    return NextResponse.json({
      message: 'Pagina duplicata con successo',
      newPageId,
      newSlug,
      sectionsCount: sectionsResult.rows.length
    });
  } catch (error) {
    console.error('Error duplicating page:', error);
    return NextResponse.json({ error: 'Errore nella duplicazione' }, { status: 500 });
  }
}
