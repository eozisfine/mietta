'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Drawer,
  Group,
  Menu,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
  Indicator
} from '@mantine/core';
import {
  IconArchive,
  IconCheck,
  IconDots,
  IconExternalLink,
  IconEye,
  IconInbox,
  IconMail,
  IconMailOpened,
  IconPhone,
  IconRefresh,
  IconSend,
  IconTrash
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  replied: boolean;
  notes: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  unread: number;
  archived: number;
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, unread: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'inbox' | 'archived'>('inbox');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const [messagesRes, statsRes] = await Promise.all([
        fetch(`/api/contacts?archived=${view === 'archived'}`),
        fetch('/api/contacts/stats')
      ]);

      if (messagesRes.ok) {
        const data = await messagesRes.json();
        setMessages(data.map((m: any) => ({
          ...m,
          read: Boolean(m.read),
          archived: Boolean(m.archived),
          replied: Boolean(m.replied)
        })));
      }

      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (error) {
      console.error('Errore fetch contatti:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [view]);

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setNotes(message.notes || '');
    setDrawerOpen(true);

    // Segna come letto se non lo e'
    if (!message.read) {
      await updateMessage(message.id, { read: true });
    }
  };

  const updateMessage = async (id: number, updates: Partial<ContactMessage>) => {
    try {
      await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      fetchMessages();

      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Errore aggiornamento:', error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Eliminare definitivamente questo messaggio?')) return;

    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      setDrawerOpen(false);
      fetchMessages();
    } catch (error) {
      console.error('Errore eliminazione:', error);
    }
  };

  const saveNotes = async () => {
    if (!selectedMessage) return;
    await updateMessage(selectedMessage.id, { notes });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ieri';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('it-IT', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
    }
  };

  return (
    <Container size="lg" py="md">
      <Group justify="space-between" mb="lg">
        <Group gap="xs">
          <IconInbox size={24} />
          <Title order={3}>Messaggi</Title>
          {stats.unread > 0 && (
            <Badge color="red" variant="filled">{stats.unread} nuovi</Badge>
          )}
        </Group>
        <Group>
          <Tooltip label="Aggiorna">
            <ActionIcon variant="subtle" onClick={fetchMessages}>
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Group mb="md" justify="space-between">
        <SegmentedControl
            w={340}
          value={view}
          onChange={(v) => setView(v as 'inbox' | 'archived')}
          data={[
            {
              value: 'inbox',
              label: (
                <Group gap={6}>
                  <IconInbox size={14} />
                  <span>Inbox ({stats.total})</span>
                </Group>
              )
            },
            {
              value: 'archived',
              label: (
                <Group gap={6}>
                  <IconArchive size={14} />
                  <span>Archiviati ({stats.archived})</span>
                </Group>
              )
            }
          ]}
        />
      </Group>

      {loading ? (
        <Text c="dimmed">Caricamento...</Text>
      ) : messages.length === 0 ? (
        <Card withBorder p="xl" ta="center">
          <IconInbox size={48} style={{ color: '#adb5bd', marginBottom: 16 }} />
          <Text c="dimmed">
            {view === 'inbox' ? 'Nessun messaggio in inbox' : 'Nessun messaggio archiviato'}
          </Text>
        </Card>
      ) : (
        <Stack gap={0}>
          {messages.map((message) => (
            <Paper
              key={message.id}
              p="sm"
              withBorder
              style={{
                cursor: 'pointer',
                borderBottom: 'none',
                backgroundColor: message.read ? '#fff' : '#f8f9ff'
              }}
              onClick={() => openMessage(message)}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                  <Indicator disabled={message.read} size={8} color="blue" offset={2}>
                    <ActionIcon variant="subtle" size="sm" color={message.read ? 'gray' : 'blue'}>
                      {message.read ? <IconMailOpened size={18} /> : <IconMail size={18} />}
                    </ActionIcon>
                  </Indicator>
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Group gap="xs" wrap="nowrap">
                      <Text fw={message.read ? 400 : 600} size="sm" truncate>
                        {message.name}
                      </Text>
                      {message.replied && (
                        <Badge size="xs" color="green" variant="light">Risposto</Badge>
                      )}
                    </Group>
                    <Text size="xs" c="dimmed" truncate>
                      {message.subject || message.message.substring(0, 60)}
                    </Text>
                  </Box>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <Text size="xs" c="dimmed">{formatDate(message.created_at)}</Text>
                  <Menu shadow="md" position="bottom-end" withinPortal>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDots size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                      <Menu.Item
                        leftSection={message.read ? <IconMail size={14} /> : <IconMailOpened size={14} />}
                        onClick={() => updateMessage(message.id, { read: !message.read })}
                      >
                        {message.read ? 'Segna come non letto' : 'Segna come letto'}
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconArchive size={14} />}
                        onClick={() => updateMessage(message.id, { archived: !message.archived })}
                      >
                        {message.archived ? 'Sposta in inbox' : 'Archivia'}
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => deleteMessage(message.id)}
                      >
                        Elimina
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Drawer dettaglio messaggio */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Dettaglio messaggio"
        position="right"
        size="md"
      >
        {selectedMessage && (
          <Stack>
            <Box>
              <Text size="xs" c="dimmed">Da</Text>
              <Text fw={500}>{selectedMessage.name}</Text>
            </Box>

            <Group>
              <Box style={{ flex: 1 }}>
                <Text size="xs" c="dimmed">Email</Text>
                <Group gap={4}>
                  <Text size="sm">{selectedMessage.email}</Text>
                  <Tooltip label="Apri client email">
                    <ActionIcon
                      variant="subtle"
                      size="xs"
                      component="a"
                      href={`mailto:${selectedMessage.email}`}
                    >
                      <IconExternalLink size={12} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Box>
              {selectedMessage.phone && (
                <Box style={{ flex: 1 }}>
                  <Text size="xs" c="dimmed">Telefono</Text>
                  <Group gap={4}>
                    <Text size="sm">{selectedMessage.phone}</Text>
                    <Tooltip label="Chiama">
                      <ActionIcon
                        variant="subtle"
                        size="xs"
                        component="a"
                        href={`tel:${selectedMessage.phone}`}
                      >
                        <IconPhone size={12} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Box>
              )}
            </Group>

            {selectedMessage.subject && (
              <Box>
                <Text size="xs" c="dimmed">Oggetto</Text>
                <Text size="sm" fw={500}>{selectedMessage.subject}</Text>
              </Box>
            )}

            <Box>
              <Text size="xs" c="dimmed">Messaggio</Text>
              <Paper p="sm" bg="gray.0" style={{ whiteSpace: 'pre-wrap' }}>
                <Text size="sm">{selectedMessage.message}</Text>
              </Paper>
            </Box>

            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                Ricevuto il {new Date(selectedMessage.created_at).toLocaleString('it-IT')}
              </Text>
            </Box>

            <Textarea
              label="Note interne"
              placeholder="Aggiungi note su questo contatto..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />

            <Group justify="space-between">
              <Group>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconCheck size={14} />}
                  color={selectedMessage.replied ? 'green' : 'gray'}
                  onClick={() => updateMessage(selectedMessage.id, { replied: !selectedMessage.replied })}
                >
                  {selectedMessage.replied ? 'Risposto' : 'Segna risposto'}
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconArchive size={14} />}
                  onClick={() => {
                    updateMessage(selectedMessage.id, { archived: !selectedMessage.archived });
                    setDrawerOpen(false);
                  }}
                >
                  {selectedMessage.archived ? 'Ripristina' : 'Archivia'}
                </Button>
              </Group>
              <Button
                size="sm"
                onClick={saveNotes}
                disabled={notes === (selectedMessage.notes || '')}
              >
                Salva note
              </Button>
            </Group>

            <Button
              component="a"
              href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Il tuo messaggio'}`}
              variant="filled"
              leftSection={<IconSend size={16} />}
              fullWidth
            >
              Rispondi via email
            </Button>
          </Stack>
        )}
      </Drawer>
    </Container>
  );
}
