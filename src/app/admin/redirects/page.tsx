'use client';

import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Drawer,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import {
  IconArrowRight,
  IconCheck,
  IconEdit,
  IconExternalLink,
  IconInfoCircle,
  IconPlus,
  IconRoute,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface Redirect {
  id: number;
  source_path: string;
  destination_path: string;
  redirect_type: number;
  enabled: boolean;
  hits: number;
  created_at: string;
}

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null);
  const [formData, setFormData] = useState({
    source_path: '',
    destination_path: '',
    redirect_type: 301,
    enabled: true
  });
  const [error, setError] = useState('');

  const fetchRedirects = async () => {
    try {
      const res = await fetch('/api/redirects');
      if (res.ok) {
        const data = await res.json();
        setRedirects(data.map((r: any) => ({
          ...r,
          enabled: Boolean(r.enabled)
        })));
      }
    } catch (error) {
      console.error('Errore fetch redirects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const openCreateDrawer = () => {
    setEditingRedirect(null);
    setFormData({
      source_path: '',
      destination_path: '',
      redirect_type: 301,
      enabled: true
    });
    setError('');
    setDrawerOpen(true);
  };

  const openEditDrawer = (redirect: Redirect) => {
    setEditingRedirect(redirect);
    setFormData({
      source_path: redirect.source_path,
      destination_path: redirect.destination_path,
      redirect_type: redirect.redirect_type,
      enabled: redirect.enabled
    });
    setError('');
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!formData.source_path || !formData.destination_path) {
      setError('Source e destination sono obbligatori');
      return;
    }

    try {
      const url = editingRedirect
        ? `/api/redirects/${editingRedirect.id}`
        : '/api/redirects';

      const res = await fetch(url, {
        method: editingRedirect ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setDrawerOpen(false);
        fetchRedirects();
      } else {
        const data = await res.json();
        setError(data.error || 'Errore nel salvataggio');
      }
    } catch (error) {
      setError('Errore di connessione');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questo redirect?')) return;

    try {
      await fetch(`/api/redirects/${id}`, { method: 'DELETE' });
      fetchRedirects();
    } catch (error) {
      console.error('Errore eliminazione:', error);
    }
  };

  const toggleEnabled = async (redirect: Redirect) => {
    try {
      await fetch(`/api/redirects/${redirect.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...redirect,
          enabled: !redirect.enabled
        })
      });
      fetchRedirects();
    } catch (error) {
      console.error('Errore toggle:', error);
    }
  };

  return (
    <Container size="lg" py="md">
      <Group justify="space-between" mb="lg">
        <Group gap="xs">
          <IconRoute size={24} />
          <Title order={3}>Redirect Manager</Title>
        </Group>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreateDrawer}>
          Nuovo redirect
        </Button>
      </Group>

      <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="md">
        Gestisci i redirect URL. I redirect 301 sono permanenti (per SEO), i 302 sono temporanei.
      </Alert>

      {loading ? (
        <Text c="dimmed">Caricamento...</Text>
      ) : redirects.length === 0 ? (
        <Card withBorder p="xl" ta="center">
          <IconRoute size={48} style={{ color: '#adb5bd', marginBottom: 16 }} />
          <Text c="dimmed" mb="md">Nessun redirect configurato</Text>
          <Button variant="light" onClick={openCreateDrawer}>
            Crea il primo redirect
          </Button>
        </Card>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Da</Table.Th>
              <Table.Th></Table.Th>
              <Table.Th>A</Table.Th>
              <Table.Th w={80} ta="center">Tipo</Table.Th>
              <Table.Th w={80} ta="center">Attivo</Table.Th>
              <Table.Th w={80} ta="center">Hits</Table.Th>
              <Table.Th w={100} ta="center">Azioni</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {redirects.map((redirect) => (
              <Table.Tr key={redirect.id} style={{ opacity: redirect.enabled ? 1 : 0.5 }}>
                <Table.Td>
                  <Text size="sm" ff="monospace">{redirect.source_path}</Text>
                </Table.Td>
                <Table.Td w={40} ta="center">
                  <IconArrowRight size={16} style={{ color: '#868e96' }} />
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Text size="sm" ff="monospace" style={{ wordBreak: 'break-all' }}>
                      {redirect.destination_path}
                    </Text>
                    {redirect.destination_path.startsWith('http') && (
                      <Tooltip label="Link esterno">
                        <IconExternalLink size={12} style={{ color: '#868e96' }} />
                      </Tooltip>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td ta="center">
                  <Badge
                    size="sm"
                    color={redirect.redirect_type === 301 ? 'blue' : 'orange'}
                    variant="light"
                  >
                    {redirect.redirect_type}
                  </Badge>
                </Table.Td>
                <Table.Td ta="center">
                  <Switch
                    size="xs"
                    checked={redirect.enabled}
                    onChange={() => toggleEnabled(redirect)}
                  />
                </Table.Td>
                <Table.Td ta="center">
                  <Text size="xs" c="dimmed">{redirect.hits}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4} justify="center">
                    <Tooltip label="Modifica">
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => openEditDrawer(redirect)}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Elimina">
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        color="red"
                        onClick={() => handleDelete(redirect.id)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      {/* Drawer per creazione/modifica */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingRedirect ? 'Modifica redirect' : 'Nuovo redirect'}
        position="right"
        size="sm"
      >
        <Stack>
          {error && (
            <Alert color="red" icon={<IconX size={16} />}>
              {error}
            </Alert>
          )}

          <TextInput
            label="Percorso origine"
            placeholder="/vecchio-url"
            description="Il percorso da cui reindirizzare (es. /vecchia-pagina)"
            value={formData.source_path}
            onChange={(e) => setFormData({ ...formData, source_path: e.target.value })}
            required
            leftSection={<Text size="xs" c="dimmed">/</Text>}
          />

          <TextInput
            label="Percorso destinazione"
            placeholder="/nuovo-url o https://..."
            description="Il percorso o URL di destinazione"
            value={formData.destination_path}
            onChange={(e) => setFormData({ ...formData, destination_path: e.target.value })}
            required
          />

          <Select
            label="Tipo redirect"
            data={[
              { value: '301', label: '301 - Permanente (SEO)' },
              { value: '302', label: '302 - Temporaneo' }
            ]}
            value={String(formData.redirect_type)}
            onChange={(val) => setFormData({ ...formData, redirect_type: Number(val) })}
            description="301 trasferisce il ranking SEO, 302 no"
          />

          <Switch
            label="Redirect attivo"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.currentTarget.checked })}
          />

          <Paper p="sm" bg="gray.0" withBorder>
            <Text size="xs" fw={500} mb="xs">Anteprima:</Text>
            <Group gap="xs">
              <Text size="xs" ff="monospace">
                {formData.source_path || '/...'}
              </Text>
              <IconArrowRight size={12} />
              <Text size="xs" ff="monospace">
                {formData.destination_path || '/...'}
              </Text>
              <Badge size="xs">{formData.redirect_type}</Badge>
            </Group>
          </Paper>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setDrawerOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.source_path || !formData.destination_path}
            >
              {editingRedirect ? 'Salva' : 'Crea'}
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
}
