import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';
import { CreatePageSchema } from '@/types/section';

// GET - Recupera tutte le pagine
export async function GET(request: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const admin = searchParams.get('admin'); // per admin mostra tutte le pagine

    let query = 'SELECT * FROM pages';
    const args: any[] = [];

    if (!admin) {
      query += ' WHERE published = 1';
      if (category) {
        query += ' AND category = ?';
        args.push(category);
      }
    } else if (category) {
      query += ' WHERE category = ?';
      args.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.execute({ sql: query, args });
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST - Crea una nuova pagina
export async function POST(request: NextRequest) {
  try {
    await initDb();
    const body = await request.json();

    const result = await db.execute({
      sql: `INSERT INTO pages (slug, title, description, category, cover_image, published, published_at, seo_title, seo_description, seo_keywords, seo_og_image, seo_no_index)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.slug,
        body.title,
        body.description || null,
        body.category,
        body.cover_image || null,
        body.published ? 1 : 0,
        body.published ? new Date().toISOString() : null,
        body.seo_title || null,
        body.seo_description || null,
        body.seo_keywords || null,
        body.seo_og_image || null,
        body.seo_no_index ? 1 : 0,
      ],
    });

    return NextResponse.json({ id: result.lastInsertRowid, ...body }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating page:', error);
    if (error.message?.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Slug già esistente' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
