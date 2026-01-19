'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Drawer,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Select,
  Tooltip,
  Alert
} from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconDownload,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconMenu2,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface MenuItem {
  id: number;
  label: string;
  href: string;
  parent_id: number | null;
  order_index: number;
  visible: boolean;
  open_in_new_tab: boolean;
  is_dynamic_dropdown: boolean;
  dropdown_source: string | null;
}

const DROPDOWN_SOURCES = [
  { value: 'eventi', label: 'Eventi (categoria evento)' },
  { value: 'vetrina', label: 'Vetrine (categoria vetrina)' },
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    parent_id: null as number | null,
    visible: true,
    open_in_new_tab: false,
    is_dynamic_dropdown: false,
    dropdown_source: null as string | null
  });

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setItems(data.map((item: any) => ({
          ...item,
          visible: Boolean(item.visible),
          open_in_new_tab: Boolean(item.open_in_new_tab),
          is_dynamic_dropdown: Boolean(item.is_dynamic_dropdown)
        })));
      }
    } catch (error) {
      console.error('Errore fetch menu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openCreateDrawer = (parentId: number | null = null) => {
    setEditingItem(null);
    setFormData({
      label: '',
      href: '',
      parent_id: parentId,
      visible: true,
      open_in_new_tab: false,
      is_dynamic_dropdown: false,
      dropdown_source: null
    });
    setDrawerOpen(true);
  };

  const openEditDrawer = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      href: item.href,
      parent_id: item.parent_id,
      visible: item.visible,
      open_in_new_tab: item.open_in_new_tab,
      is_dynamic_dropdown: item.is_dynamic_dropdown,
      dropdown_source: item.dropdown_source
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label) return;
    if (!formData.is_dynamic_dropdown && !formData.href) return;

    try {
      const payload = {
        ...formData,
        href: formData.is_dynamic_dropdown ? '#' : formData.href
      };

      if (editingItem) {
        await fetch(`/api/menu/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            order_index: editingItem.order_index
          })
        });
      } else {
        const siblings = items.filter(i => i.parent_id === formData.parent_id);
        const maxOrder = siblings.length > 0 ? Math.max(...siblings.map(s => s.order_index)) : -1;

        await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            order_index: maxOrder + 1
          })
        });
      }

      setDrawerOpen(false);
      fetchMenu();
    } catch (error) {
      console.error('Errore salvataggio:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questa voce di menu? Le voci figlie saranno eliminate.')) return;

    try {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      fetchMenu();
    } catch (error) {
      console.error('Errore eliminazione:', error);
    }
  };

  const handleMove = async (item: MenuItem, direction: 'up' | 'down') => {
    const siblings = items
      .filter(i => i.parent_id === item.parent_id)
      .sort((a, b) => a.order_index - b.order_index);

    const currentIndex = siblings.findIndex(s => s.id === item.id);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (swapIndex < 0 || swapIndex >= siblings.length) return;

    const swapItem = siblings[swapIndex];

    try {
      await fetch('/api/menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            { id: item.id, order_index: swapItem.order_index, parent_id: item.parent_id },
            { id: swapItem.id, order_index: item.order_index, parent_id: swapItem.parent_id }
          ]
        })
      });
      fetchMenu();
    } catch (error) {
      console.error('Errore riordinamento:', error);
    }
  };

  const toggleVisibility = async (item: MenuItem) => {
    try {
      await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          visible: !item.visible
        })
      });
      fetchMenu();
    } catch (error) {
      console.error('Errore toggle visibilita:', error);
    }
  };

  // Organizza in struttura gerarchica
  const rootItems = items.filter(i => !i.parent_id).sort((a, b) => a.order_index - b.order_index);
  const getChildren = (parentId: number) =>
    items.filter(i => i.parent_id === parentId).sort((a, b) => a.order_index - b.order_index);

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const children = getChildren(item.id);
    const siblings = items.filter(i => i.parent_id === item.parent_id);
    const itemIndex = siblings.findIndex(s => s.id === item.id);

    return (
      <Box key={item.id}>
        <Paper
          p="sm"
          mb="xs"
          withBorder
          style={{
            marginLeft: level * 24,
            opacity: item.visible ? 1 : 0.5,
            borderLeft: level > 0 ? '3px solid var(--mantine-color-blue-4)' : undefined
          }}
        >
          <Group justify="space-between">
            <Group gap="sm">
              <IconGripVertical size={16} style={{ color: '#adb5bd', cursor: 'grab' }} />
              <Box>
                <Group gap="xs">
                  <Text fw={500} size="sm">{item.label}</Text>
                  {item.is_dynamic_dropdown && (
                    <Badge size="xs" color="violet" leftSection={<IconChevronDown size={10} />}>
                      Dropdown: {item.dropdown_source}
                    </Badge>
                  )}
                  {!item.visible && <Badge size="xs" color="gray">Nascosto</Badge>}
                  {item.open_in_new_tab && (
                    <Tooltip label="Apre in nuova tab">
                      <IconExternalLink size={14} style={{ color: '#868e96' }} />
                    </Tooltip>
                  )}
                </Group>
                <Text size="xs" c="dimmed">
                  {item.is_dynamic_dropdown ? 'Carica dinamicamente da pagine' : item.href}
                </Text>
              </Box>
            </Group>

            <Group gap={4}>
              <Tooltip label="Sposta su">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => handleMove(item, 'up')}
                  disabled={itemIndex === 0}
                >
                  <IconArrowUp size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Sposta giu">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => handleMove(item, 'down')}
                  disabled={itemIndex === siblings.length - 1}
                >
                  <IconArrowDown size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={item.visible ? 'Nascondi' : 'Mostra'}>
                <ActionIcon variant="subtle" size="sm" onClick={() => toggleVisibility(item)}>
                  {item.visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Modifica">
                <ActionIcon variant="subtle" size="sm" onClick={() => openEditDrawer(item)}>
                  <IconEdit size={14} />
                </ActionIcon>
              </Tooltip>
              {level === 0 && !item.is_dynamic_dropdown && (
                <Tooltip label="Aggiungi sottomenu">
                  <ActionIcon variant="subtle" size="sm" color="blue" onClick={() => openCreateDrawer(item.id)}>
                    <IconPlus size={14} />
                  </ActionIcon>
                </Tooltip>
              )}
              <Tooltip label="Elimina">
                <ActionIcon variant="subtle" size="sm" color="red" onClick={() => handleDelete(item.id)}>
                  <IconTrash size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Paper>
        {children.map(child => renderMenuItem(child, level + 1))}
      </Box>
    );
  };

  const parentOptions = rootItems
    .filter(item => !item.is_dynamic_dropdown)
    .map(item => ({
      value: String(item.id),
      label: item.label
    }));

  return (
    <Container size="lg" py="md">
      <Group justify="space-between" mb="lg">
        <Group gap="xs">
          <IconMenu2 size={24} />
          <Title order={3}>Gestione Menu</Title>
        </Group>
        <Button leftSection={<IconPlus size={16} />} onClick={() => openCreateDrawer()}>
          Nuova voce
        </Button>
      </Group>

      <Alert color="blue" mb="md">
        Gestisci la struttura del menu di navigazione. Le voci con badge "Dropdown" caricano automaticamente le pagine dalla categoria indicata.
      </Alert>

      {loading ? (
        <Text c="dimmed">Caricamento...</Text>
      ) : items.length === 0 ? (
        <Card withBorder p="xl" ta="center">
          <Text c="dimmed" mb="md">Nessuna voce di menu</Text>
          <Group justify="center" gap="md">
            <Button
              variant="filled"
              leftSection={<IconDownload size={16} />}
              onClick={async () => {
                const res = await fetch('/api/menu/seed', { method: 'POST' });
                if (res.ok) {
                  fetchMenu();
                }
              }}
            >
              Carica menu predefinito
            </Button>
            <Button variant="light" onClick={() => openCreateDrawer()}>
              Crea manualmente
            </Button>
          </Group>
        </Card>
      ) : (
        <Stack gap={0}>
          {rootItems.map(item => renderMenuItem(item))}
        </Stack>
      )}

      {/* Drawer per creazione/modifica */}
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingItem ? 'Modifica voce menu' : 'Nuova voce menu'}
        position="right"
        size="sm"
      >
        <Stack>
          <TextInput
            label="Etichetta"
            placeholder="es. Chi siamo"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            required
          />

          <Checkbox
            label="Dropdown dinamico"
            description="Carica automaticamente le pagine da una categoria"
            checked={formData.is_dynamic_dropdown}
            onChange={(e) => setFormData({
              ...formData,
              is_dynamic_dropdown: e.currentTarget.checked,
              href: e.currentTarget.checked ? '#' : formData.href,
              parent_id: e.currentTarget.checked ? null : formData.parent_id
            })}
          />

          {formData.is_dynamic_dropdown ? (
            <Select
              label="Sorgente dati"
              description="Categoria delle pagine da mostrare nel dropdown"
              data={DROPDOWN_SOURCES}
              value={formData.dropdown_source}
              onChange={(val) => setFormData({ ...formData, dropdown_source: val })}
              required
            />
          ) : (
            <>
              <TextInput
                label="Link (href)"
                placeholder="es. /chi-siamo o https://..."
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                required
              />

              <Select
                label="Voce padre (opzionale)"
                placeholder="Nessuna (voce principale)"
                data={parentOptions}
                value={formData.parent_id ? String(formData.parent_id) : null}
                onChange={(val) => setFormData({ ...formData, parent_id: val ? Number(val) : null })}
                clearable
                disabled={!!editingItem && getChildren(editingItem.id).length > 0}
              />

              <Checkbox
                label="Apri in nuova tab"
                checked={formData.open_in_new_tab}
                onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.currentTarget.checked })}
              />
            </>
          )}

          <Checkbox
            label="Visibile nel menu"
            checked={formData.visible}
            onChange={(e) => setFormData({ ...formData, visible: e.currentTarget.checked })}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setDrawerOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.label || (!formData.is_dynamic_dropdown && !formData.href)}
            >
              {editingItem ? 'Salva' : 'Crea'}
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
}
