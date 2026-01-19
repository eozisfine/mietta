'use client';

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  ThemeIcon,
  Group,
  Stack,
} from '@mantine/core';
import {
  IconFiles,
  IconPhoto,
  IconMenu2,
  IconInbox,
  IconRoute,
  IconDatabase,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';

const guides = [
  {
    title: 'Page Builder',
    description: 'Crea e modifica pagine dinamiche con sezioni drag & drop',
    icon: IconFiles,
    href: '/admin/guide/page-builder',
    color: 'blue',
  },
  {
    title: 'Asset Manager',
    description: 'Carica, organizza e ottimizza immagini e file',
    icon: IconPhoto,
    href: '/admin/guide/assets',
    color: 'green',
  },
  {
    title: 'Menu',
    description: 'Gestisci la navigazione del sito e i dropdown dinamici',
    icon: IconMenu2,
    href: '/admin/guide/menu',
    color: 'violet',
  },
  {
    title: 'Contatti',
    description: 'Gestisci i messaggi ricevuti dal form di contatto',
    icon: IconInbox,
    href: '/admin/guide/contacts',
    color: 'orange',
  },
  {
    title: 'Redirect',
    description: 'Configura reindirizzamenti URL permanenti o temporanei',
    icon: IconRoute,
    href: '/admin/guide/redirects',
    color: 'red',
  },
  {
    title: 'Backup',
    description: 'Esporta e ripristina i dati del database',
    icon: IconDatabase,
    href: '/admin/guide/backup',
    color: 'cyan',
  },
  {
    title: 'Impostazioni',
    description: 'Configura le impostazioni generali del sito',
    icon: IconSettings,
    href: '/admin/guide/settings',
    color: 'gray',
  },
  {
    title: 'Utenti',
    description: 'Gestisci gli account amministratori',
    icon: IconUsers,
    href: '/admin/guide/users',
    color: 'pink',
  },
];

export default function GuidePage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="xs">Guida CMS</Title>
          <Text c="dimmed">
            Seleziona una sezione per visualizzare la documentazione.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {guides.map((guide) => (
            <Card
              key={guide.href}
              component={Link}
              href={guide.href}
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: 'pointer', textDecoration: 'none' }}
            >
              <Group gap="md" mb="xs">
                <ThemeIcon size="lg" radius="md" variant="light" color={guide.color}>
                  <guide.icon size={20} />
                </ThemeIcon>
                <Text fw={500}>{guide.title}</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {guide.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
