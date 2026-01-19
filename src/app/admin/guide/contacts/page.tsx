'use client';

import {
  Container, Title, Text, Stack, Paper, List, Group, ThemeIcon, ActionIcon, Badge,
} from '@mantine/core';
import { IconInbox, IconArrowLeft, IconMail, IconArchive, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function ContactsGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="orange">
          <IconInbox size={20} />
        </ThemeIcon>
        <Title order={3}>Gestione Contatti</Title>
      </Group>

      <Stack gap="md">
        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Inbox messaggi</Text>
          <Text size="sm" c="dimmed">
            Tutti i messaggi inviati tramite il form di contatto del sito vengono raccolti qui.
            Puoi visualizzarli, segnarli come letti e archiviarli.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Stati dei messaggi</Text>
          <Group gap="xs">
            <Badge color="blue">Non letto</Badge>
            <Badge color="gray">Letto</Badge>
            <Badge color="green" leftSection={<IconCheck size={12} />}>Risposto</Badge>
            <Badge color="dark" leftSection={<IconArchive size={12} />}>Archiviato</Badge>
          </Group>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Informazioni messaggio</Text>
          <List size="sm" spacing="xs">
            <List.Item>Nome del mittente</List.Item>
            <List.Item>Email di contatto</List.Item>
            <List.Item>Telefono (opzionale)</List.Item>
            <List.Item>Oggetto del messaggio</List.Item>
            <List.Item>Contenuto completo</List.Item>
            <List.Item>Data e ora di invio</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Azioni disponibili</Text>
          <List size="sm" spacing="xs">
            <List.Item>Segna come letto/non letto</List.Item>
            <List.Item>Segna come risposto</List.Item>
            <List.Item>Archivia messaggio</List.Item>
            <List.Item>Aggiungi note interne</List.Item>
            <List.Item>Elimina definitivamente</List.Item>
          </List>
        </Paper>
      </Stack>
    </Container>
  );
}
