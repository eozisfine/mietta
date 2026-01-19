import { NextRequest, NextResponse } from 'next/server';
import { db, initDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDb();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || 'evento';

    // Recupera pagine pubblicate per categoria, ordinate per data (più recenti prima)
    const result = await db.execute({
      sql: `SELECT id, slug, title, description, cover_image, created_at
            FROM pages
            WHERE category = ? AND published = 1
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?`,
      args: [category, limit, offset],
    });

    // Conta il totale per sapere se ce ne sono altri
    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM pages WHERE category = ? AND published = 1`,
      args: [category],
    });

    const total = (countResult.rows[0] as any).total;
    const hasMore = offset + limit < total;

    return NextResponse.json({
      events: result.rows,
      hasMore,
      total,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({
      error: 'Failed to fetch events',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
