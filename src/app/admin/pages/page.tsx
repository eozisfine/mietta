'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Button,
  Group,
  Text,
  TextInput,
  Textarea,
  Select,
  Modal,
  ActionIcon,
  Badge,
  Table,
  Checkbox,
  Tabs,
  Tooltip,
  Menu,
  Switch,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconEdit,
  IconEye,
  IconFolderOpen,
  IconDotsVertical,
  IconLayoutDashboard,
  IconSearch,
  IconCopy,
} from '@tabler/icons-react';
import { Page } from '@/types/section';
import AssetPickerDrawer from '@/components/AssetPickerDrawer';

const CATEGORIES = [
  { value: 'evento', label: 'Evento' },
  { value: 'vetrina', label: 'Vetrina' },
  { value: 'static-page', label: 'Pagina Statica' },
];

export default function AdminPagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('generale');

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    category: 'evento',
    cover_image: '',
    published: true,
    published_at: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_og_image: '',
    seo_no_index: false,
  });

  const [assetPickerOpened, setAssetPickerOpened] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'cover' | 'og'>('cover');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages?admin=1');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        published_at: formData.published && !editingPage?.published_at
          ? new Date().toISOString()
          : formData.published_at || null,
      };

      if (editingPage) {
        await fetch(`/api/pages/${editingPage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      fetchPages();
      closeModal();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Errore nel salvataggio. Lo slug potrebbe essere già in uso.');
    }
  };

  const handleDeleteClick = async (id: number) => {
    const page = pages.find(p => p.id === id);
    const pageName = page?.title || 'questa pagina';

    if (!confirm(`Sei sicuro di voler eliminare "${pageName}"?\n\nQuesta azione è irreversibile e eliminerà anche tutte le sezioni associate.`)) {
      return;
    }

    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Errore durante l\'eliminazione della pagina');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      const response = await fetch(`/api/pages/${id}/duplicate`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        fetchPages();
        alert(`Pagina duplicata! Nuovo slug: ${result.newSlug}`);
      } else {
        const error = await response.json();
        alert(`Errore: ${error.error}`);
      }
    } catch (error) {
      console.error('Error duplicating page:', error);
      alert('Errore durante la duplicazione');
    }
  };

  const openModal = (page?: Page) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        slug: page.slug,
        title: page.title,
        description: page.description || '',
        category: page.category,
        cover_image: page.cover_image || '',
        published: !!page.published,
        published_at: page.published_at || '',
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
        seo_keywords: page.seo_keywords || '',
        seo_og_image: page.seo_og_image || '',
        seo_no_index: !!page.seo_no_index,
      });
    } else {
      setEditingPage(null);
      setFormData({
        slug: '',
        title: '',
        description: '',
        category: 'evento',
        cover_image: '',
        published: true,
        published_at: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        seo_og_image: '',
        seo_no_index: false,
      });
    }
    setActiveTab('generale');
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
    setEditingPage(null);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const getPageUrl = (page: Page) => {
    if (page.category === 'static-page') {
      return `/${page.slug}`;
    }
    return `/eventi/${page.slug}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const hasSeo = (page: Page) => {
    return !!(page.seo_title || page.seo_description || page.seo_keywords);
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <Center h="100vh">
      <Loader type="dots" size="xl" color="blue" />
    </Center>
  );

  return (
    <Container size="xl" py="md">
      {/* Header compatto */}
      <Group justify="space-between" mb="md">
        <Title order={3}>Gestione Pagine</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => openModal()}
          size="sm"
        >
          Nuova
        </Button>
      </Group>

      {/* Filtro ricerca */}
      <TextInput
        placeholder="Cerca per titolo o slug..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="md"
        size="sm"
      />

      {/* Tabella pagine */}
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Titolo</Table.Th>
            <Table.Th>Categoria</Table.Th>
            <Table.Th>URL</Table.Th>
            <Table.Th w={80} ta="center">SEO</Table.Th>
            <Table.Th w={100} ta="center">Pubblicata</Table.Th>
            <Table.Th w={120}>Data Pub.</Table.Th>
            <Table.Th w={100} ta="center">Azioni</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredPages.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center" c="dimmed" py="lg">
                  {searchQuery ? 'Nessun risultato trovato.' : 'Nessuna pagina creata. Clicca su "Nuova" per iniziare.'}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            filteredPages.map((page) => (
              <Table.Tr key={page.id}>
                <Table.Td>
                  <Text fw={500} size="sm">{page.title}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" variant="light">
                    {CATEGORIES.find(c => c.value === page.category)?.label}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">{getPageUrl(page)}</Text>
                </Table.Td>
                <Table.Td ta="center">
                  {hasSeo(page) ? (
                    <Badge size="xs" color="green">OK</Badge>
                  ) : (
                    <Badge size="xs" color="gray">-</Badge>
                  )}
                </Table.Td>
                <Table.Td ta="center">
                  {page.published ? (
                    <Badge size="xs" color="green">Si</Badge>
                  ) : (
                    <Badge size="xs" color="red">No</Badge>
                  )}
                </Table.Td>
                <Table.Td>
                  <Text size="xs">{formatDate(page.published_at)}</Text>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={200} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="sm">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        onClick={() => window.open(`/admin/preview/${page.slug}`, '_blank')}
                      >
                        Anteprima
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconLayoutDashboard size={14} />}
                        onClick={() => router.push(`/admin/pages/${page.id}`)}
                      >
                        Modifica sezioni
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        onClick={() => openModal(page)}
                      >
                        Modifica dettagli
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconCopy size={14} />}
                        onClick={() => handleDuplicate(page.id!)}
                      >
                        Duplica pagina
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDeleteClick(page.id!)}
                      >
                        Elimina
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {/* Modal Modifica Dettagli */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editingPage ? 'Modifica Pagina' : 'Nuova Pagina'}
        size="md"
      >
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List mb="md">
            <Tabs.Tab value="generale">Generale</Tabs.Tab>
            <Tabs.Tab value="seo">SEO</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="generale">
            <Select
              label="Categoria"
              data={CATEGORIES}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value! })}
              size="sm"
              mb="sm"
            />

            <TextInput
              label="Titolo"
              placeholder="Titolo pagina"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({
                  ...formData,
                  title,
                  slug: editingPage ? formData.slug : generateSlug(title)
                });
              }}
              size="sm"
              mb="sm"
              required
            />

            <TextInput
              label="Slug (URL)"
              placeholder="url-pagina"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              size="sm"
              mb="sm"
              required
            />

            <Textarea
              label="Descrizione"
              placeholder="Breve descrizione..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              minRows={2}
              size="sm"
              mb="sm"
            />

            <TextInput
              label="Immagine copertina"
              placeholder="URL immagine"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              size="sm"
              mb="sm"
              rightSection={
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setAssetPickerTarget('cover');
                    setAssetPickerOpened(true);
                  }}
                >
                  <IconFolderOpen size={16} />
                </ActionIcon>
              }
            />

            <Switch
              label="Pubblicata"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.currentTarget.checked })}
              mb="md"
            />
          </Tabs.Panel>

          <Tabs.Panel value="seo">
            <TextInput
              label="Titolo SEO"
              description="Lascia vuoto per usare il titolo pagina"
              placeholder="Titolo per motori di ricerca"
              value={formData.seo_title}
              onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
              size="sm"
              mb="sm"
            />

            <Textarea
              label="Meta Description"
              description="Max 160 caratteri consigliati"
              placeholder="Descrizione per i risultati di ricerca..."
              value={formData.seo_description}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              minRows={2}
              size="sm"
              mb="sm"
            />

            <TextInput
              label="Keywords"
              description="Separate da virgola"
              placeholder="keyword1, keyword2, keyword3"
              value={formData.seo_keywords}
              onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
              size="sm"
              mb="sm"
            />

            <TextInput
              label="Immagine Open Graph"
              description="Immagine condivisione social (1200x630 px)"
              placeholder="URL immagine"
              value={formData.seo_og_image}
              onChange={(e) => setFormData({ ...formData, seo_og_image: e.target.value })}
              size="sm"
              mb="sm"
              rightSection={
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setAssetPickerTarget('og');
                    setAssetPickerOpened(true);
                  }}
                >
                  <IconFolderOpen size={16} />
                </ActionIcon>
              }
            />

            <Switch
              label="No Index (nascondi dai motori di ricerca)"
              checked={formData.seo_no_index}
              onChange={(e) => setFormData({ ...formData, seo_no_index: e.currentTarget.checked })}
              mb="md"
            />
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={closeModal} size="sm">
            Annulla
          </Button>
          <Button onClick={handleSubmit} size="sm">
            {editingPage ? 'Salva' : 'Crea'}
          </Button>
        </Group>
      </Modal>

      {/* Asset Picker */}
      <AssetPickerDrawer
        opened={assetPickerOpened}
        onClose={() => setAssetPickerOpened(false)}
        onSelect={(url) => {
          if (assetPickerTarget === 'cover') {
            setFormData({ ...formData, cover_image: url });
          } else {
            setFormData({ ...formData, seo_og_image: url });
          }
        }}
        title="Seleziona Immagine"
        filterImages={true}
      />
    </Container>
  );
}
