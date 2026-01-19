'use client';

import { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Timeline,
  Modal,
  Badge,
  Group,
  Paper,
  ScrollArea,
  ThemeIcon,
  Code,
  List,
  Stack,
  Divider,
} from '@mantine/core';
import {
  IconGitBranch,
  IconRocket,
  IconSparkles,
  IconCode,
} from '@tabler/icons-react';

// Dati delle versioni
const versions = [
  {
    version: '1.1',
    date: '18 Gennaio 2026',
    status: 'current',
    summary: 'Parallax, spacing, responsive visibility, history',
    highlights: [
      'Effetto Parallax per sezioni con immagine',
      'Controlli spacing personalizzati (padding/margin)',
      'Visibilità responsive per breakpoint',
      'Cronologia e ripristino sezioni',
      'Pagina guida admin completa',
      'Redirect manager con integrazione middleware',
    ],
    details: {
      features: [
        {
          title: 'Effetto Parallax',
          description: 'Background-attachment: fixed per sezioni con immagine. Supportato su HeaderImageFull, HeroImageCenter, ImageBoxRightFullh, ImageBoxLeftFullh, BannerWithLink, ImageTextOverlayLeft.',
        },
        {
          title: 'Controlli Spacing',
          description: 'Padding e margin top/bottom configurabili per ogni sezione con valori Mantine standard (xs, sm, md, lg, xl, 2xl...).',
        },
        {
          title: 'Visibilità Responsive',
          description: 'Mostra/nascondi sezioni su specifici breakpoint (xs, sm, md, lg, xl).',
        },
        {
          title: 'History Sezioni',
          description: 'Sistema di cronologia con registrazione di tutte le modifiche alle sezioni.',
        },
        {
          title: 'Guida Admin',
          description: 'Documentazione completa accessibile da /admin/guide con sezioni per ogni funzionalità.',
        },
        {
          title: 'Redirect Manager',
          description: 'Gestione redirect 301/302 con contatore hits e integrazione nel middleware Next.js.',
        },
      ],
      technical: [
        'Nuove colonne DB: image_fixed, padding_top/bottom, margin_top/bottom, visible_from, hidden_from',
        'Middleware Next.js per redirect con cache in memoria (TTL 60s)',
        'API endpoint /api/redirects/active per middleware',
        'API endpoint /api/redirects/hit per contatore',
        'Conversione booleani SQLite (0/1)',
        'BreakpointEnum e SpacingEnum con transform per stringhe vuote',
      ],
    },
  },
  {
    version: '1.0',
    date: 'Gennaio 2026',
    status: 'stable',
    summary: 'Release iniziale del CMS',
    highlights: [
      'Page Builder con sezioni drag & drop',
      'Asset Manager con upload Vercel Blob',
      'Gestione menu dinamico',
      'Form contatti con inbox',
      'Sistema redirect',
      'Backup/restore JSON',
      'Autenticazione admin',
    ],
    details: null, // Nessun documento dettagliato per v1.0
  },
];

export default function ChangelogPage() {
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<typeof versions[0] | null>(null);

  const openVersionDetails = (version: typeof versions[0]) => {
    if (version.details) {
      setSelectedVersion(version);
      setModalOpened(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'green';
      case 'stable':
        return 'blue';
      case 'beta':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current':
        return 'Corrente';
      case 'stable':
        return 'Stabile';
      case 'beta':
        return 'Beta';
      default:
        return status;
    }
  };

  return (
    <Container size="md" py="md">
      <Group gap="xs" mb="lg">
        <ThemeIcon size="lg" variant="light" color="violet">
          <IconGitBranch size={20} />
        </ThemeIcon>
        <Title order={3}>Changelog</Title>
      </Group>

      <Text c="dimmed" mb="xl">
        Cronologia delle versioni e delle modifiche al CMS.
      </Text>

      <Timeline active={0} bulletSize={32} lineWidth={2}>
        {versions.map((version, index) => (
          <Timeline.Item
            key={version.version}
            bullet={
              <ThemeIcon
                size={32}
                variant={index === 0 ? 'filled' : 'light'}
                color={getStatusColor(version.status)}
                radius="xl"
              >
                {index === 0 ? <IconRocket size={18} /> : <IconSparkles size={18} />}
              </ThemeIcon>
            }
            title={
              <Group gap="sm">
                <Text fw={600} size="lg">v{version.version}</Text>
                <Badge color={getStatusColor(version.status)} size="sm">
                  {getStatusLabel(version.status)}
                </Badge>
              </Group>
            }
          >
            <Text size="xs" c="dimmed" mt={4}>{version.date}</Text>
            <Text size="sm" mt="xs">{version.summary}</Text>

            <Paper
              withBorder
              p="sm"
              mt="sm"
              style={{ cursor: version.details ? 'pointer' : 'default' }}
              onClick={() => openVersionDetails(version)}
              bg={version.details ? undefined : 'gray.0'}
            >
              <List size="sm" spacing={4}>
                {version.highlights.map((highlight, i) => (
                  <List.Item key={i}>{highlight}</List.Item>
                ))}
              </List>
              {version.details && (
                <Text size="xs" c="blue" mt="sm" fw={500}>
                  Clicca per vedere i dettagli →
                </Text>
              )}
              {!version.details && (
                <Text size="xs" c="dimmed" mt="sm" fs="italic">
                  Nessun documento dettagliato disponibile
                </Text>
              )}
            </Paper>
          </Timeline.Item>
        ))}
      </Timeline>

      {/* Modal dettagli versione */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={
          <Group gap="sm">
            <IconGitBranch size={20} />
            <Text fw={600}>Changelog v{selectedVersion?.version}</Text>
            <Badge color="green" size="sm">{selectedVersion?.date}</Badge>
          </Group>
        }
        size="lg"
      >
        {selectedVersion?.details && (
          <ScrollArea h={500}>
            <Stack gap="lg">
              {/* Nuove funzionalità */}
              <div>
                <Group gap="xs" mb="sm">
                  <ThemeIcon size="sm" variant="light" color="green">
                    <IconSparkles size={14} />
                  </ThemeIcon>
                  <Text fw={600}>Nuove Funzionalità</Text>
                </Group>
                <Stack gap="sm">
                  {selectedVersion.details.features.map((feature, i) => (
                    <Paper key={i} withBorder p="sm">
                      <Text fw={500} size="sm">{feature.title}</Text>
                      <Text size="xs" c="dimmed" mt={4}>{feature.description}</Text>
                    </Paper>
                  ))}
                </Stack>
              </div>

              <Divider />

              {/* Dettagli tecnici */}
              <div>
                <Group gap="xs" mb="sm">
                  <ThemeIcon size="sm" variant="light" color="blue">
                    <IconCode size={14} />
                  </ThemeIcon>
                  <Text fw={600}>Dettagli Tecnici</Text>
                </Group>
                <List size="xs" spacing={6}>
                  {selectedVersion.details.technical.map((item, i) => (
                    <List.Item key={i}>
                      <Code>{item}</Code>
                    </List.Item>
                  ))}
                </List>
              </div>
            </Stack>
          </ScrollArea>
        )}
      </Modal>
    </Container>
  );
}
