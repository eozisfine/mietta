'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  List,
  Code,
  Alert,
  Group,
  ThemeIcon,
  ActionIcon,
  Badge,
} from '@mantine/core';
import {
  IconPhoto,
  IconArrowLeft,
  IconUpload,
  IconFolderOpen,
  IconTrash,
  IconReplace,
  IconInfoCircle,
  IconTransform,
  IconRuler,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function AssetsGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="green">
          <IconPhoto size={20} />
        </ThemeIcon>
        <Title order={3}>Asset Manager</Title>
      </Group>

      <Stack gap="md">
        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Cos'è l'Asset Manager?</Text>
          <Text size="sm" c="dimmed">
            L'Asset Manager ti permette di caricare, organizzare e gestire tutti i file
            multimediali del sito. I file sono archiviati su Vercel Blob per prestazioni ottimali.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <IconUpload size={18} />
            <Text fw={500}>Caricamento file</Text>
          </Group>
          <List size="sm" spacing="xs">
            <List.Item>Drag & drop direttamente nell'area di upload</List.Item>
            <List.Item>Click sul pulsante "Carica" per selezionare i file</List.Item>
            <List.Item>Supporta upload multiplo</List.Item>
            <List.Item>Formati supportati: JPG, PNG, WebP, GIF, SVG, PDF</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <IconFolderOpen size={18} />
            <Text fw={500}>Organizzazione in cartelle</Text>
          </Group>
          <Text size="sm" c="dimmed" mb="xs">
            Puoi organizzare i file in cartelle virtuali usando i prefissi:
          </Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>eventi/</Code> - File relativi agli eventi</List.Item>
            <List.Item><Code>progetti/</Code> - Immagini dei progetti</List.Item>
            <List.Item><Code>generale/</Code> - File generici del sito</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <IconRuler size={18} />
            <Text fw={500}>Informazioni file</Text>
          </Group>
          <Text size="sm" c="dimmed">
            Per ogni file puoi visualizzare:
          </Text>
          <List size="sm" spacing="xs">
            <List.Item>Dimensioni in pixel (larghezza x altezza)</List.Item>
            <List.Item>Peso del file (KB/MB)</List.Item>
            <List.Item>Formato del file</List.Item>
            <List.Item>Data di caricamento</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Group gap="xs" mb="sm">
            <IconTransform size={18} />
            <Text fw={500}>Conversione immagini</Text>
          </Group>
          <Text size="sm" c="dimmed" mb="xs">
            Puoi convertire le immagini in formato WebP per ridurre le dimensioni
            mantenendo la qualità. Usa il pulsante "Converti" nel menu dell'immagine.
          </Text>
          <Alert icon={<IconInfoCircle size={16} />} color="blue" mt="sm">
            WebP offre compressione superiore rispetto a JPG/PNG, migliorando i tempi di caricamento.
          </Alert>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Azioni disponibili</Text>
          <Group gap="xs">
            <Badge leftSection={<IconReplace size={12} />} variant="light" color="blue">
              Sostituisci
            </Badge>
            <Badge leftSection={<IconTransform size={12} />} variant="light" color="green">
              Converti WebP
            </Badge>
            <Badge leftSection={<IconTrash size={12} />} variant="light" color="red">
              Elimina
            </Badge>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">
            "Sostituisci" aggiorna automaticamente tutti i riferimenti nel database.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Asset Picker</Text>
          <Text size="sm" c="dimmed">
            Nel Page Builder, quando selezioni un campo immagine, si apre l'Asset Picker
            che ti permette di scegliere tra i file già caricati o caricarne di nuovi.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
