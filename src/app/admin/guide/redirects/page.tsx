'use client';

import {
  Container, Title, Text, Stack, Paper, List, Code, Alert, Group, ThemeIcon, ActionIcon, Badge,
} from '@mantine/core';
import { IconRoute, IconArrowLeft, IconInfoCircle, IconCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function RedirectsGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="red">
          <IconRoute size={20} />
        </ThemeIcon>
        <Title order={3}>Gestione Redirect</Title>
      </Group>

      <Stack gap="md">
        <Alert icon={<IconCheck size={16} />} color="green" title="Integrato nel middleware">
          I redirect sono completamente integrati in Next.js e vengono applicati automaticamente
          a livello server con cache per prestazioni ottimali.
        </Alert>

        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Cos'è un redirect?</Text>
          <Text size="sm" c="dimmed">
            Un redirect reindirizza automaticamente i visitatori da un URL a un altro.
            Utile quando rinomini una pagina o riorganizzi la struttura del sito.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Tipi di redirect</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Badge color="blue" mr="xs">301</Badge>
              <strong>Permanente</strong> - Indica ai motori di ricerca che la pagina è stata spostata definitivamente
            </List.Item>
            <List.Item>
              <Badge color="orange" mr="xs">302</Badge>
              <strong>Temporaneo</strong> - Indica che il redirect è temporaneo
            </List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Campi</Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>Percorso sorgente</Code> - URL originale (es: /vecchia-pagina)</List.Item>
            <List.Item><Code>Destinazione</Code> - Nuovo URL (interno o esterno)</List.Item>
            <List.Item><Code>Tipo</Code> - 301 (permanente) o 302 (temporaneo)</List.Item>
            <List.Item><Code>Attivo</Code> - Abilita/disabilita il redirect</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Contatore utilizzo</Text>
          <Text size="sm" c="dimmed">
            Ogni redirect tiene traccia del numero di volte che è stato utilizzato.
            Questo ti aiuta a capire quali URL vecchi vengono ancora visitati.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Esempi di utilizzo</Text>
          <List size="sm" spacing="xs">
            <List.Item>
              <Code>/vecchio-evento</Code> → <Code>/eventi/nuovo-nome</Code>
            </List.Item>
            <List.Item>
              <Code>/contatti</Code> → <Code>/contact</Code>
            </List.Item>
            <List.Item>
              <Code>/promo</Code> → <Code>https://shop.example.com</Code>
            </List.Item>
          </List>
        </Paper>

        <Alert icon={<IconInfoCircle size={16} />} color="blue">
          I redirect hanno una cache di 60 secondi per ottimizzare le prestazioni.
          Le modifiche potrebbero richiedere fino a un minuto per essere attive.
        </Alert>
      </Stack>
    </Container>
  );
}
