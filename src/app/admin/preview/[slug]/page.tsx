import { notFound } from 'next/navigation';
import { db, initDb } from '@/lib/db';
import AnimatedSection from '@/components/AnimatedSection';
import SectionRenderer from '@/components/SectionRenderer';
import { PageSection } from '@/types/section';
import { Container, Alert, Badge, Group, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPageBySlug(slug: string) {
  await initDb();

  // Cerca in tutte le pagine (anche non pubblicate) per anteprima admin
  const pageResult = await db.execute({
    sql: 'SELECT * FROM pages WHERE slug = ?',
    args: [slug],
  });

  if (pageResult.rows.length === 0) {
    return null;
  }

  const page = pageResult.rows[0] as any;

  const sectionsResult = await db.execute({
    sql: 'SELECT * FROM page_sections WHERE page_id = ? ORDER BY order_index ASC',
    args: [page.id],
  });

  return {
    page,
    sections: sectionsResult.rows as unknown as PageSection[],
  };
}

export default async function AdminPreviewPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPageBySlug(slug);

  if (!data) {
    notFound();
  }

  const { page, sections } = data;

  return (
    <>
      {/* Banner di anteprima */}
      <Container size="xl" py="sm">
        <Alert
          icon={<IconInfoCircle size={16} />}
          color="orange"
          variant="light"
        >
          <Group gap="xs">
            <Text size="sm" fw={500}>Modalità Anteprima Admin</Text>
            {!page.published && (
              <Badge color="red" size="sm">Non Pubblicata</Badge>
            )}
            <Text size="xs" c="dimmed">
              Questa pagina è visibile solo agli amministratori
            </Text>
          </Group>
        </Alert>
      </Container>

      {/* Contenuto pagina */}
      {sections.length === 0 ? (
        <Container size="xl" py="xl">
          <Alert color="blue">
            Questa pagina non ha ancora sezioni configurate.
          </Alert>
        </Container>
      ) : (
        sections.map((section) => (
          <AnimatedSection
            key={section.id}
            animation={(section.animation || 'fadeUp') as 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'fadeIn' | 'fadeBlur' | 'fadeScale' | 'fadeSlide'}
            delay={section.animation_delay || 0.1}
          >
            <SectionRenderer section={section} />
          </AnimatedSection>
        ))
      )}
    </>
  );
}
