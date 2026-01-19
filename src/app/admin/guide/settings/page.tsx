'use client';

import {
  Container, Title, Text, Stack, Paper, List, Code, Group, ThemeIcon, ActionIcon,
} from '@mantine/core';
import { IconSettings, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function SettingsGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="gray">
          <IconSettings size={20} />
        </ThemeIcon>
        <Title order={3}>Impostazioni</Title>
      </Group>

      <Stack gap="md">
        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Impostazioni generali</Text>
          <Text size="sm" c="dimmed">
            Configura le impostazioni globali del sito che vengono utilizzate
            in diverse parti dell'applicazione.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Impostazioni disponibili</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Code>site_name</Code> - Nome del sito visualizzato nel browser
            </List.Item>
            <List.Item>
              <Code>site_description</Code> - Meta description di default
            </List.Item>
            <List.Item>
              <Code>contact_email</Code> - Email per notifiche form contatto
            </List.Item>
            <List.Item>
              <Code>google_analytics</Code> - ID Google Analytics (GA4)
            </List.Item>
            <List.Item>
              <Code>social_facebook</Code> - URL pagina Facebook
            </List.Item>
            <List.Item>
              <Code>social_instagram</Code> - URL profilo Instagram
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Tipi di valore</Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>text</Code> - Testo semplice</List.Item>
            <List.Item><Code>textarea</Code> - Testo lungo multiriga</List.Item>
            <List.Item><Code>boolean</Code> - Vero/Falso (switch)</List.Item>
            <List.Item><Code>number</Code> - Valore numerico</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Aggiungere nuove impostazioni</Text>
          <Text size="sm" c="dimmed">
            Puoi aggiungere nuove impostazioni personalizzate. Inserisci una chiave
            univoca (usa underscore per separare le parole) e seleziona il tipo appropriato.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
