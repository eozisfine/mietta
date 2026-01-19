'use client';

import {
  Container, Title, Text, Stack, Paper, List, Code, Alert, Group, ThemeIcon, ActionIcon,
} from '@mantine/core';
import { IconMenu2, IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import Link from 'next/link';

export default function MenuGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="violet">
          <IconMenu2 size={20} />
        </ThemeIcon>
        <Title order={3}>Gestione Menu</Title>
      </Group>

      <Stack gap="md">
        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Menu di navigazione</Text>
          <Text size="sm" c="dimmed">
            Gestisci le voci del menu principale del sito. Puoi creare una struttura
            gerarchica con sottomenu e dropdown.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Campi disponibili</Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>Label</Code> - Testo visualizzato nel menu</List.Item>
            <List.Item><Code>Href</Code> - URL di destinazione (interno o esterno)</List.Item>
            <List.Item><Code>Visibile</Code> - Mostra/nascondi la voce</List.Item>
            <List.Item><Code>Apri in nuova tab</Code> - Per link esterni</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Dropdown dinamici</Text>
          <Text size="sm" c="dimmed" mb="xs">
            Puoi creare dropdown che si popolano automaticamente con le pagine di una categoria:
          </Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>evento</Code> - Mostra tutti gli eventi pubblicati</List.Item>
            <List.Item><Code>vetrina</Code> - Mostra tutti i progetti</List.Item>
          </List>
          <Alert icon={<IconInfoCircle size={16} />} color="blue" mt="sm">
            Il dropdown si aggiorna automaticamente quando aggiungi nuove pagine.
          </Alert>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Ordinamento</Text>
          <Text size="sm" c="dimmed">
            Trascina le voci per riordinarle. L'ordine viene salvato automaticamente.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
