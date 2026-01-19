import { notFound } from 'next/navigation';
import { db, initDb } from '@/lib/db';
import { Page, PageSection } from '@/types/section';
import SectionRenderer from '@/components/SectionRenderer';
import AnimatedSection from '@/components/AnimatedSection';
import styles from '../../page.module.css';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await initDb();

  const result = await db.execute({
    sql: 'SELECT * FROM pages WHERE slug = ? AND category = ? AND published = 1',
    args: [slug, 'evento'],
  });

  if (result.rows.length === 0) {
    return { title: 'Pagina non trovata' };
  }

  const page = result.rows[0] as any;
  const title = page.seo_title || page.title;
  const description = page.seo_description || page.description || '';
  const ogImage = page.seo_og_image || page.cover_image;

  return {
    title,
    description,
    keywords: page.seo_keywords || undefined,
    robots: page.seo_no_index ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title,
      description,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function EventoPage({ params }: PageProps) {
  const { slug } = await params;
  await initDb();

  // Recupera la pagina
  const pageResult: any = await db.execute({
    sql: 'SELECT * FROM pages WHERE slug = ? AND category = ? AND published = 1',
    args: [slug, 'evento'],
  });

  if (pageResult.rows.length === 0) {
    notFound();
  }

  const page: Page = pageResult.rows[0];

  // Recupera le sezioni della pagina
  const sectionsResult = await db.execute({
    sql: 'SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC',
    args: [page.id],
  });

  const sections = sectionsResult.rows as unknown as PageSection[];

  return (
    <div className={styles.page}>
      {sections.map((section) => (
        <AnimatedSection
          key={section.id}
          animation={section.animation as any}
          delay={section.animation_delay}
        >
          <SectionRenderer section={section} />
        </AnimatedSection>
      ))}
    </div>
  );
}
