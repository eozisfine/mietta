'use client';

import {
  Container, Title, Text, Stack, Paper, List, Code, Alert, Group, ThemeIcon, ActionIcon,
} from '@mantine/core';
import { IconDatabase, IconArrowLeft, IconAlertTriangle, IconDownload, IconUpload } from '@tabler/icons-react';
import Link from 'next/link';

export default function BackupGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="cyan">
          <IconDatabase size={20} />
        </ThemeIcon>
        <Title order={3}>Backup e Ripristino</Title>
      </Group>

      <Stack gap="md">
        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Sistema di backup</Text>
          <Text size="sm" c="dimmed">
            Esporta tutti i dati del CMS in formato JSON per creare backup
            o trasferire i contenuti tra ambienti diversi.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <IconDownload size={18} />
            <Text fw={500}>Esportazione</Text>
          </Group>
          <Text size="sm" c="dimmed" mb="xs">
            Il backup include tutte le tabelle del database:
          </Text>
          <List size="sm" spacing="xs">
            <List.Item>Pagine e sezioni</List.Item>
            <List.Item>Menu di navigazione</List.Item>
            <List.Item>Messaggi di contatto</List.Item>
            <List.Item>Redirect</List.Item>
            <List.Item>Impostazioni sito</List.Item>
            <List.Item>Cronologia modifiche</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <IconUpload size={18} />
            <Text fw={500}>Ripristino</Text>
          </Group>
          <Text size="sm" c="dimmed">
            Carica un file JSON di backup per ripristinare i dati.
            Puoi scegliere quali tabelle importare.
          </Text>
        </Paper>

        <Alert icon={<IconAlertTriangle size={16} />} color="orange" title="Attenzione">
          Il ripristino sovrascrive i dati esistenti. Assicurati di avere un backup
          recente prima di procedere con un'importazione.
        </Alert>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Cronologia backup</Text>
          <Text size="sm" c="dimmed">
            Tutti i backup vengono registrati con data, dimensione e tabelle incluse.
            Puoi scaricare nuovamente i backup precedenti dalla cronologia.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Best practices</Text>
          <List size="sm" spacing="xs">
            <List.Item>Esegui backup regolari (almeno settimanali)</List.Item>
            <List.Item>Scarica il backup prima di modifiche importanti</List.Item>
            <List.Item>Conserva più versioni di backup</List.Item>
            <List.Item>Testa il ripristino in ambiente di sviluppo</List.Item>
          </List>
        </Paper>
      </Stack>
    </Container>
  );
}
