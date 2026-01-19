import { notFound } from 'next/navigation';
import { db, initDb } from '@/lib/db';
import { Page, PageSection } from '@/types/section';
import SectionRenderer from '@/components/SectionRenderer';
import AnimatedSection from '@/components/AnimatedSection';
import styles from '../page.module.css';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPageFromDb(slug: string): Promise<{ page: Page; sections: PageSection[] } | null> {
  try {
    await initDb();

    const pageResult = await db.execute({
      sql: 'SELECT * FROM pages WHERE slug = ? AND category = ? AND published = 1',
      args: [slug, 'static-page'],
    });

    if (pageResult.rows.length === 0) {
      return null;
    }

    const page = pageResult.rows[0] as unknown as Page;

    const sectionsResult = await db.execute({
      sql: 'SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC',
      args: [page.id],
    });

    return {
      page,
      sections: sectionsResult.rows as unknown as PageSection[],
    };
  } catch (error) {
    console.error('Errore nel recupero pagina dal database:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = slug.join('/');
  const data = await getPageFromDb(fullSlug);

  if (data) {
    const page = data.page;
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
        type: 'website',
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

  return {
    title: 'Pagina non trovata',
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = slug.join('/');

  // Cerca la pagina nel database
  const data = await getPageFromDb(fullSlug);

  // Se non esiste nel DB, 404
  if (!data || data.sections.length === 0) {
    notFound();
  }

  return (
    <div className={styles.page}>
      {data.sections.map((section) => {
        if (section.animation === 'none') {
          return <SectionRenderer key={section.id} section={section} />;
        }

        return (
          <AnimatedSection
            key={section.id}
            animation={section.animation as any}
            delay={section.animation_delay}
          >
            <SectionRenderer section={section} />
          </AnimatedSection>
        );
      })}
    </div>
  );
}
