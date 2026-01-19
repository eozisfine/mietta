'use client';

import {
  Container, Title, Text, Stack, Paper, List, Code, Alert, Group, ThemeIcon, ActionIcon, Badge,
} from '@mantine/core';
import { IconUsers, IconArrowLeft, IconAlertTriangle, IconShieldCheck } from '@tabler/icons-react';
import Link from 'next/link';

export default function UsersGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="pink">
          <IconUsers size={20} />
        </ThemeIcon>
        <Title order={3}>Gestione Utenti</Title>
      </Group>

      <Stack gap="md">
        <Paper withBorder p="md">
          <Text fw={500} mb="xs">Account amministratori</Text>
          <Text size="sm" c="dimmed">
            Gestisci gli account che possono accedere al pannello di amministrazione.
            Ogni utente ha credenziali separate e può essere abilitato/disabilitato.
          </Text>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Informazioni utente</Text>
          <List size="sm" spacing="xs">
            <List.Item><Code>Email</Code> - Usata per il login (deve essere univoca)</List.Item>
            <List.Item><Code>Password</Code> - Criptata con hash SHA-256</List.Item>
            <List.Item><Code>Ruolo</Code> - Al momento solo "admin"</List.Item>
            <List.Item><Code>Stato</Code> - Abilitato/Disabilitato</List.Item>
            <List.Item><Code>Ultimo accesso</Code> - Data e ora dell'ultimo login</List.Item>
          </List>
        </Paper>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Azioni disponibili</Text>
          <List size="sm" spacing="xs">
            <List.Item>Creare nuovi utenti admin</List.Item>
            <List.Item>Modificare email e password</List.Item>
            <List.Item>Abilitare/disabilitare account</List.Item>
            <List.Item>Reset password</List.Item>
            <List.Item>Eliminare utenti</List.Item>
          </List>
        </Paper>

        <Alert icon={<IconShieldCheck size={16} />} color="green" title="Sicurezza">
          Le password sono criptate e non vengono mai memorizzate in chiaro.
          Le sessioni scadono automaticamente dopo 7 giorni.
        </Alert>

        <Alert icon={<IconAlertTriangle size={16} />} color="orange">
          Non è possibile eliminare l'ultimo utente admin attivo per evitare
          di rimanere bloccati fuori dal sistema.
        </Alert>

        <Paper withBorder p="md">
          <Text fw={500} mb="sm">Reset password</Text>
          <Text size="sm" c="dimmed">
            In caso di password dimenticata, un admin può generare un link di reset
            per un altro utente. Il link è valido per 24 ore.
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}
