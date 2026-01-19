import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface UsagePoint {
  type: 'page' | 'section';
  pageId: number;
  pageTitle: string;
  pageSlug: string;
  field: string;
  sectionId?: number;
  sectionType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL richiesto' }, { status: 400 });
    }

    const usagePoints: UsagePoint[] = [];

    // Cerca nelle pagine (cover_image, seo_og_image)
    const pagesWithCover = await db.execute({
      sql: `SELECT id, title, slug FROM pages WHERE cover_image = ?`,
      args: [url],
    });

    for (const page of pagesWithCover.rows) {
      usagePoints.push({
        type: 'page',
        pageId: page.id as number,
        pageTitle: page.title as string,
        pageSlug: page.slug as string,
        field: 'cover_image',
      });
    }

    const pagesWithOgImage = await db.execute({
      sql: `SELECT id, title, slug FROM pages WHERE seo_og_image = ?`,
      args: [url],
    });

    for (const page of pagesWithOgImage.rows) {
      usagePoints.push({
        type: 'page',
        pageId: page.id as number,
        pageTitle: page.title as string,
        pageSlug: page.slug as string,
        field: 'seo_og_image',
      });
    }

    // Cerca nelle sezioni (image, image_mobile)
    const sectionsWithImage = await db.execute({
      sql: `
        SELECT ps.id as section_id, ps.section_type, ps.page_id, p.title as page_title, p.slug as page_slug
        FROM page_sections ps
        JOIN pages p ON p.id = ps.page_id
        WHERE ps.image = ?
      `,
      args: [url],
    });

    for (const section of sectionsWithImage.rows) {
      usagePoints.push({
        type: 'section',
        pageId: section.page_id as number,
        pageTitle: section.page_title as string,
        pageSlug: section.page_slug as string,
        field: 'image',
        sectionId: section.section_id as number,
        sectionType: section.section_type as string,
      });
    }

    const sectionsWithMobileImage = await db.execute({
      sql: `
        SELECT ps.id as section_id, ps.section_type, ps.page_id, p.title as page_title, p.slug as page_slug
        FROM page_sections ps
        JOIN pages p ON p.id = ps.page_id
        WHERE ps.image_mobile = ?
      `,
      args: [url],
    });

    for (const section of sectionsWithMobileImage.rows) {
      usagePoints.push({
        type: 'section',
        pageId: section.page_id as number,
        pageTitle: section.page_title as string,
        pageSlug: section.page_slug as string,
        field: 'image_mobile',
        sectionId: section.section_id as number,
        sectionType: section.section_type as string,
      });
    }

    return NextResponse.json({
      url,
      inUse: usagePoints.length > 0,
      usageCount: usagePoints.length,
      usagePoints,
    });
  } catch (error) {
    console.error('Check usage error:', error);
    return NextResponse.json(
      { error: 'Errore nel controllo utilizzo' },
      { status: 500 }
    );
  }
}
