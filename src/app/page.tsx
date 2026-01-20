import { db, initDb } from '@/lib/db';
import { Page, PageSection } from '@/types/section';
import SectionRenderer from '@/components/SectionRenderer';
import AnimatedSection from '@/components/AnimatedSection';
import styles from './page.module.css';

const HOMEPAGE_SLUG = 'homepage';
const HOMEPAGE_CATEGORY = 'static-page';

async function getHomepageSections(): Promise<PageSection[] | null> {
    try {
    await initDb();

    const pageResult = await db.execute({
      sql: 'SELECT * FROM pages WHERE slug = ? AND category = ? AND published = 1',
      args: [HOMEPAGE_SLUG, HOMEPAGE_CATEGORY],
    });

    if (pageResult.rows.length === 0) {
      return null;
    }

    const page = pageResult.rows[0] as unknown as Page;

    const sectionsResult = await db.execute({
      sql: 'SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC',
      args: [page.id],
    });

    return sectionsResult.rows as unknown as PageSection[];
  } catch (error) {
    console.error('Errore nel recupero della homepage dal database:', error);
    return null;
  }
}

export default async function Home() {
  const sections = await getHomepageSections();

  if (!sections || sections.length === 0) {
    return (
      <div className={styles.page} style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-title), Buda, serif', marginBottom: '20px' }}>
          Database non inizializzato
        </h1>
        <p style={{ marginBottom: '10px' }}>Esegui il seed del database chiamando:</p>
        <code style={{
          display: 'block',
          background: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          POST /api/seed-mietta
        </code>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {sections.map((section) => {
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
