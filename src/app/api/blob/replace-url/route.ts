import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { oldUrl, newUrl } = await request.json();

    if (!oldUrl || !newUrl) {
      return NextResponse.json({ error: 'URL vecchio e nuovo richiesti' }, { status: 400 });
    }

    let replacedCount = 0;

    // Sostituisci in pages.cover_image
    const coverResult = await db.execute({
      sql: `UPDATE pages SET cover_image = ?, updated_at = CURRENT_TIMESTAMP WHERE cover_image = ?`,
      args: [newUrl, oldUrl],
    });
    replacedCount += coverResult.rowsAffected;

    // Sostituisci in pages.seo_og_image
    const ogResult = await db.execute({
      sql: `UPDATE pages SET seo_og_image = ?, updated_at = CURRENT_TIMESTAMP WHERE seo_og_image = ?`,
      args: [newUrl, oldUrl],
    });
    replacedCount += ogResult.rowsAffected;

    // Sostituisci in page_sections.image
    const imageResult = await db.execute({
      sql: `UPDATE page_sections SET image = ?, updated_at = CURRENT_TIMESTAMP WHERE image = ?`,
      args: [newUrl, oldUrl],
    });
    replacedCount += imageResult.rowsAffected;

    // Sostituisci in page_sections.image_mobile
    const mobileResult = await db.execute({
      sql: `UPDATE page_sections SET image_mobile = ?, updated_at = CURRENT_TIMESTAMP WHERE image_mobile = ?`,
      args: [newUrl, oldUrl],
    });
    replacedCount += mobileResult.rowsAffected;

    return NextResponse.json({
      success: true,
      replacedCount,
      oldUrl,
      newUrl,
    });
  } catch (error) {
    console.error('Replace URL error:', error);
    return NextResponse.json(
      { error: 'Errore nella sostituzione URL' },
      { status: 500 }
    );
  }
}
