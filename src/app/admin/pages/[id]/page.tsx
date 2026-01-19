'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Button,
  Stack,
  Group,
  Text,
  TextInput,
  Textarea,
  Select,
  Drawer,
  ActionIcon,
  Badge,
  NumberInput,
  Paper,
  Alert,
  Divider,
  Box,
  Tooltip,
  Loader,
  Center,
  Switch,
  Collapse,
  Grid,
} from '@mantine/core';
import { IconPlus, IconTrash, IconEdit, IconArrowUp, IconArrowDown, IconInfoCircle, IconPhoto, IconArrowLeft, IconFolderOpen, IconEye, IconHistory, IconSettings, IconDeviceMobile, IconDeviceDesktop } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Page, PageSection } from '@/types/section';
import { SECTION_TYPES, getActiveFields } from '@/config/section-fields';
import AssetPickerDrawer from '@/components/AssetPickerDrawer';
import SectionRenderer from '@/components/SectionRenderer';
import ScrollCardsEditor from '@/components/section-editors/ScrollCardsEditor';
import NumberedStepsEditor from '@/components/section-editors/NumberedStepsEditor';
import PhotoGalleryEditor from '@/components/section-editors/PhotoGalleryEditor';
import ThreeColumnGridEditor from '@/components/section-editors/ThreeColumnGridEditor';

const ANIMATIONS = [
  { value: 'fadeUp', label: 'Fade Up' },
  { value: 'fadeDown', label: 'Fade Down' },
  { value: 'fadeLeft', label: 'Fade Left' },
  { value: 'fadeRight', label: 'Fade Right' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'scale', label: 'Scale' },
];

const SPACING_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
];

const BREAKPOINT_OPTIONS = [
  { value: '', label: 'Nessuno' },
  { value: 'xs', label: 'XS (< 576px)' },
  { value: 'sm', label: 'SM (≥ 576px)' },
  { value: 'md', label: 'MD (≥ 768px)' },
  { value: 'lg', label: 'LG (≥ 992px)' },
  { value: 'xl', label: 'XL (≥ 1200px)' },
];

// Sezioni che supportano effetto parallax (hanno immagine di sfondo)
const PARALLAX_SECTIONS = [
  'HeaderImageFull',
  'HeroImageCenter',
  'ImageBoxRightFullh',
  'ImageBoxLeftFullh',
  'BannerWithLink',
  'ImageTextOverlayLeft',
  'TitleCenterImage',
];

export default function PageSectionsEditor() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id as string;

  const [page, setPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<PageSection[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    section_type: 'HeaderImageFull',
    title: '',
    text: '',
    image: '',
    image_mobile: '',
    href: '',
    button_text: '',
    animation: 'fadeUp',
    animation_delay: 0.1,
    // v1.1
    image_fixed: false,
    padding_top: '',
    padding_bottom: '',
    margin_top: '',
    margin_bottom: '',
    visible_from: '',
    hidden_from: '',
  });

  const [advancedOpened, { toggle: toggleAdvanced }] = useDisclosure(false);

  const [assetPickerOpened, setAssetPickerOpened] = useState(false);
  const [assetPickerTarget, setAssetPickerTarget] = useState<'image' | 'image_mobile'>('image');
  const [assetPickerCallback, setAssetPickerCallback] = useState<((url: string) => void) | null>(null);
  const [historyDrawerOpened, setHistoryDrawerOpened] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Ottieni la configurazione dei campi per il tipo di sezione corrente
  const currentFieldConfig = getActiveFields(formData.section_type);

  // Helper per aprire asset picker con callback personalizzato (per editor complessi)
  const openAssetPickerWithCallback = (callback: (url: string) => void) => {
    setAssetPickerCallback(() => callback);
    setAssetPickerOpened(true);
  };

  // Sezioni che usano editor complessi
  const isComplexSection = ['ScrollCards', 'NumberedStepsGrid', 'PhotoGallery', 'ThreeColumnGrid'].includes(formData.section_type);

  useEffect(() => {
    fetchPage();
    fetchSections();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/pages/${pageId}`);
      const data = await response.json();
      setPage(data);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await fetch(`/api/pages/${pageId}/sections`);
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`/api/pages/${pageId}/history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const saveHistory = async (action: string, entityType: string, entityId: number | null, description: string, oldData?: any, newData?: any) => {
    try {
      await fetch(`/api/pages/${pageId}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, entity_type: entityType, entity_id: entityId, description, old_data: oldData, new_data: newData }),
      });
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const openHistoryDrawer = () => {
    fetchHistory();
    setHistoryDrawerOpened(true);
  };

  const handleSubmit = async () => {
    try {
      const order_index = editingSection ? editingSection.order_index : sections.length;
      const sectionTypeName = SECTION_TYPES.find(t => t.value === formData.section_type)?.label || formData.section_type;

      if (editingSection) {
        await fetch(`/api/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order_index }),
        });
        // Salva nello storico
        await saveHistory(
          'update',
          'section',
          editingSection.id!,
          `Modificata sezione "${sectionTypeName}"`,
          editingSection,
          formData
        );
      } else {
        const response = await fetch(`/api/pages/${pageId}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order_index }),
        });
        const newSection = await response.json();
        // Salva nello storico
        await saveHistory(
          'create',
          'section',
          newSection.id,
          `Aggiunta sezione "${sectionTypeName}"`,
          null,
          formData
        );
      }

      fetchSections();
      closeModal();
    } catch (error) {
      console.error('Error saving section:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questa sezione?')) return;

    const sectionToDelete = sections.find(s => s.id === id);
    const sectionTypeName = sectionToDelete
      ? SECTION_TYPES.find(t => t.value === sectionToDelete.section_type)?.label || sectionToDelete.section_type
      : 'Sezione';

    try {
      await fetch(`/api/sections/${id}`, { method: 'DELETE' });
      // Salva nello storico
      await saveHistory(
        'delete',
        'section',
        id,
        `Eliminata sezione "${sectionTypeName}"`,
        sectionToDelete,
        null
      );
      fetchSections();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const movedSection = newSections[index];
    const sectionTypeName = SECTION_TYPES.find(t => t.value === movedSection.section_type)?.label || movedSection.section_type;

    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

    const reorderedSections = newSections.map((section, idx) => ({
      id: section.id!,
      order_index: idx,
    }));

    try {
      await fetch('/api/sections/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: reorderedSections }),
      });
      // Salva nello storico
      await saveHistory(
        'reorder',
        'section',
        movedSection.id!,
        `Spostata sezione "${sectionTypeName}" ${direction === 'up' ? 'su' : 'giù'}`,
        { from: index + 1, to: targetIndex + 1 },
        null
      );
      fetchSections();
    } catch (error) {
      console.error('Error reordering sections:', error);
    }
  };

  const openModal = (section?: PageSection) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        section_type: section.section_type,
        title: section.title || '',
        text: section.text || '',
        image: section.image || '',
        image_mobile: (section as any).image_mobile || '',
        href: (section as any).href || '',
        button_text: (section as any).button_text || '',
        animation: section.animation,
        animation_delay: section.animation_delay,
        // v1.1
        image_fixed: !!(section as any).image_fixed,
        padding_top: (section as any).padding_top || '',
        padding_bottom: (section as any).padding_bottom || '',
        margin_top: (section as any).margin_top || '',
        margin_bottom: (section as any).margin_bottom || '',
        visible_from: (section as any).visible_from || '',
        hidden_from: (section as any).hidden_from || '',
      });
    } else {
      setEditingSection(null);
      setFormData({
        section_type: 'HeaderImageFull',
        title: '',
        text: '',
        image: '',
        image_mobile: '',
        href: '',
        button_text: '',
        animation: 'fadeUp',
        animation_delay: 0.1,
        // v1.1
        image_fixed: false,
        padding_top: '',
        padding_bottom: '',
        margin_top: '',
        margin_bottom: '',
        visible_from: '',
        hidden_from: '',
      });
    }
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
    setEditingSection(null);
  };

  if (loading || !page) return (
    <Center h="100vh">
      <Loader type="dots" size="xl" color="blue" />
    </Center>
  );

  return (
    <Box>
      {/* Header sticky compatto */}
      <Paper
        shadow="xs"
        px="sm"
        py={6}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid #e9ecef',
        }}
      >
        <Group justify="space-between">
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              onClick={() => router.push('/admin/pages')}
              size="sm"
            >
              <IconArrowLeft size={16} />
            </ActionIcon>
            <Text size="sm" fw={500}>{page.title}</Text>
            <Badge size="xs" variant="light">{page.category}</Badge>
            <Text size="xs" c="dimmed">/{page.slug}</Text>
          </Group>
          <Group gap={4}>
            <Tooltip label="Anteprima">
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => window.open(`/admin/preview/${page.slug}`, '_blank')}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Cronologia">
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={openHistoryDrawer}
              >
                <IconHistory size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Aggiungi sezione">
              <ActionIcon
                variant="light"
                size="sm"
                onClick={() => openModal()}
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>

      {/* Contenuto pagina con sezioni reali */}
      {sections.length === 0 ? (
        <Container size="xl" py="xl">
          <Alert icon={<IconInfoCircle size={20} />} title="Nessuna sezione" color="blue">
            Questa pagina non ha ancora sezioni. Clicca su "Aggiungi sezione" per iniziare.
          </Alert>
        </Container>
      ) : (
        <Stack gap={0}>
          {sections.map((section, index) => (
            <Box key={section.id} style={{ position: 'relative' }}>
              {/* Rendering reale della sezione */}
              <SectionRenderer section={section} />

              {/* Toolbar sotto la sezione */}
              <Paper
                shadow="sm"
                p="xs"
                style={{
                  background: 'white',
                  borderTop: '1px solid #e9ecef',
                  borderBottom: '1px solid #e9ecef',
                }}
              >
                <Container size="xl">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <Badge size="sm" variant="light" color="gray">
                        #{index + 1}
                      </Badge>
                      <Text size="sm" c="dimmed" fw={500}>
                        {SECTION_TYPES.find(t => t.value === section.section_type)?.label}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Tooltip label="Sposta su">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          onClick={() => moveSection(index, 'up')}
                          disabled={index === 0}
                        >
                          <IconArrowUp size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Sposta giù">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          size="sm"
                          onClick={() => moveSection(index, 'down')}
                          disabled={index === sections.length - 1}
                        >
                          <IconArrowDown size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Divider orientation="vertical" />
                      <Tooltip label="Modifica">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="sm"
                          onClick={() => openModal(section)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Elimina">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(section.id!)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>
                </Container>
              </Paper>
            </Box>
          ))}
        </Stack>
      )}

      {/* Drawer laterale per editing */}
      <Drawer
        opened={modalOpened}
        onClose={closeModal}
        title={editingSection ? 'Modifica Sezione' : 'Nuova Sezione'}
        position="right"
        size="md"
        overlayProps={{ backgroundOpacity: 0.3 }}
      >
        <Stack gap="md">
          <Select
            label="Tipo di sezione"
            description="Ogni tipo ha campi specifici"
            data={SECTION_TYPES}
            value={formData.section_type}
            onChange={(value) => setFormData({ ...formData, section_type: value! })}
            size="sm"
          />

          <Divider label="Contenuto" labelPosition="center" />

          {/* Campo Titolo */}
          {currentFieldConfig?.fields.title && (
            <TextInput
              label="Titolo"
              description={currentFieldConfig.descriptions?.title || 'Supporta HTML: <b>, <i>, <br/>'}
              placeholder="Es: La nostra <b>storia</b>"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              size="sm"
            />
          )}

          {/* Campo Testo */}
          {currentFieldConfig?.fields.text && (
            <Textarea
              label="Testo"
              description={currentFieldConfig.descriptions?.text || 'Supporta HTML'}
              placeholder="Il testo della sezione..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              minRows={3}
              size="sm"
            />
          )}

          {/* Campo Immagine */}
          {currentFieldConfig?.fields.image && (
            <TextInput
              label="Immagine"
              description={currentFieldConfig.descriptions?.image || 'Seleziona un asset'}
              placeholder="Seleziona un'immagine..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              size="sm"
              leftSection={<IconPhoto size={14} />}
              rightSection={
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setAssetPickerTarget('image');
                    setAssetPickerOpened(true);
                  }}
                >
                  <IconFolderOpen size={16} />
                </ActionIcon>
              }
            />
          )}

          {/* Campo Immagine Mobile */}
          {currentFieldConfig?.fields.imageMobile && (
            <TextInput
              label="Immagine Mobile"
              description={currentFieldConfig.descriptions?.imageMobile || 'Immagine alternativa per dispositivi mobile'}
              placeholder="Seleziona un'immagine per mobile..."
              value={formData.image_mobile}
              onChange={(e) => setFormData({ ...formData, image_mobile: e.target.value })}
              size="sm"
              leftSection={<IconPhoto size={14} />}
              rightSection={
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    setAssetPickerTarget('image_mobile');
                    setAssetPickerOpened(true);
                  }}
                >
                  <IconFolderOpen size={16} />
                </ActionIcon>
              }
            />
          )}

          {/* Campo Link/Href */}
          {currentFieldConfig?.fields.href && (
            <TextInput
              label="Link"
              description={currentFieldConfig.descriptions?.href || 'URL di destinazione'}
              placeholder="Es: /evento/nome oppure https://..."
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              size="sm"
            />
          )}

          {/* Campo Testo Bottone */}
          {currentFieldConfig?.fields.buttonText && (
            <TextInput
              label="Testo Bottone"
              description={currentFieldConfig.descriptions?.buttonText || 'Testo personalizzato per il bottone'}
              placeholder="Es: PRENOTA ORA"
              value={formData.button_text}
              onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
              size="sm"
            />
          )}

          {/* Editor ScrollCards */}
          {formData.section_type === 'ScrollCards' && (
            <>
              <Divider label="Cards" labelPosition="center" />
              <ScrollCardsEditor
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                onOpenAssetPicker={openAssetPickerWithCallback}
              />
            </>
          )}

          {/* Editor NumberedStepsGrid */}
          {formData.section_type === 'NumberedStepsGrid' && (
            <>
              <Divider label="Passi" labelPosition="center" />
              <NumberedStepsEditor
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
              />
            </>
          )}

          {/* Editor PhotoGallery */}
          {formData.section_type === 'PhotoGallery' && (
            <>
              <Divider label="Galleria foto" labelPosition="center" />
              <PhotoGalleryEditor
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                onOpenAssetPicker={openAssetPickerWithCallback}
              />
            </>
          )}

          {/* Editor ThreeColumnGrid */}
          {formData.section_type === 'ThreeColumnGrid' && (
            <>
              <Divider label="Griglia 3 colonne" labelPosition="center" />
              <ThreeColumnGridEditor
                titleValue={formData.title}
                textValue={formData.text}
                onTitleChange={(value) => setFormData({ ...formData, title: value })}
                onTextChange={(value) => setFormData({ ...formData, text: value })}
                onOpenAssetPicker={openAssetPickerWithCallback}
              />
            </>
          )}

          <Divider label="Animazione" labelPosition="center" />

          <Group grow>
            <Select
              label="Tipo"
              data={ANIMATIONS}
              value={formData.animation}
              onChange={(value) => setFormData({ ...formData, animation: value! })}
              size="sm"
            />

            <NumberInput
              label="Ritardo (s)"
              value={formData.animation_delay}
              onChange={(value) => setFormData({ ...formData, animation_delay: Number(value) })}
              min={0}
              max={2}
              step={0.1}
              decimalScale={1}
              size="sm"
            />
          </Group>

          {/* v1.1: Opzioni avanzate */}
          <Divider
            label={
              <Group gap="xs" style={{ cursor: 'pointer' }} onClick={toggleAdvanced}>
                <IconSettings size={14} />
                <Text size="xs">Opzioni avanzate</Text>
              </Group>
            }
            labelPosition="center"
          />

          <Collapse in={advancedOpened}>
            <Stack gap="md">
              {/* Parallax - solo per sezioni con immagine di sfondo */}
              {PARALLAX_SECTIONS.includes(formData.section_type) && (
                <Switch
                  label="Effetto Parallax"
                  description="Sfondo fisso durante lo scroll"
                  checked={formData.image_fixed}
                  onChange={(e) => setFormData({ ...formData, image_fixed: e.currentTarget.checked })}
                  size="sm"
                />
              )}

              {/* Spacing */}
              <Text size="xs" fw={500} c="dimmed">Spaziatura</Text>
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Select
                    label="Padding Top"
                    data={SPACING_OPTIONS}
                    value={formData.padding_top}
                    onChange={(value) => setFormData({ ...formData, padding_top: value || '' })}
                    size="xs"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Padding Bottom"
                    data={SPACING_OPTIONS}
                    value={formData.padding_bottom}
                    onChange={(value) => setFormData({ ...formData, padding_bottom: value || '' })}
                    size="xs"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Margin Top"
                    data={SPACING_OPTIONS}
                    value={formData.margin_top}
                    onChange={(value) => setFormData({ ...formData, margin_top: value || '' })}
                    size="xs"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Margin Bottom"
                    data={SPACING_OPTIONS}
                    value={formData.margin_bottom}
                    onChange={(value) => setFormData({ ...formData, margin_bottom: value || '' })}
                    size="xs"
                    clearable
                  />
                </Grid.Col>
              </Grid>

              {/* Visibilità responsive */}
              <Text size="xs" fw={500} c="dimmed">
                <Group gap={4}>
                  <IconDeviceMobile size={14} />
                  <IconDeviceDesktop size={14} />
                  Visibilità responsive
                </Group>
              </Text>
              <Grid gutter="xs">
                <Grid.Col span={6}>
                  <Select
                    label="Visibile da"
                    description="Mostra da questo breakpoint in su"
                    data={BREAKPOINT_OPTIONS}
                    value={formData.visible_from}
                    onChange={(value) => setFormData({ ...formData, visible_from: value || '' })}
                    size="xs"
                    clearable
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Nascosto da"
                    description="Nascondi da questo breakpoint in su"
                    data={BREAKPOINT_OPTIONS}
                    value={formData.hidden_from}
                    onChange={(value) => setFormData({ ...formData, hidden_from: value || '' })}
                    size="xs"
                    clearable
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Collapse>

          <Divider my="sm" />

          <Group justify="flex-end" gap="xs">
            <Button variant="subtle" color="gray" onClick={closeModal} size="sm">
              Annulla
            </Button>
            <Button onClick={handleSubmit} size="sm">
              {editingSection ? 'Salva' : 'Crea'}
            </Button>
          </Group>
        </Stack>
      </Drawer>

      {/* Asset Picker Drawer */}
      <AssetPickerDrawer
        opened={assetPickerOpened}
        onClose={() => {
          setAssetPickerOpened(false);
          setAssetPickerCallback(null);
        }}
        onSelect={(url) => {
          if (assetPickerCallback) {
            assetPickerCallback(url);
            setAssetPickerCallback(null);
          } else if (assetPickerTarget === 'image') {
            setFormData({ ...formData, image: url });
          } else {
            setFormData({ ...formData, image_mobile: url });
          }
        }}
        title={assetPickerCallback ? 'Seleziona Immagine' : (assetPickerTarget === 'image' ? 'Seleziona Immagine' : 'Seleziona Immagine Mobile')}
        filterImages={true}
      />

      {/* History Drawer */}
      <Drawer
        opened={historyDrawerOpened}
        onClose={() => setHistoryDrawerOpened(false)}
        title="Cronologia modifiche"
        position="right"
        size="md"
      >
        {historyLoading ? (
          <Center py="xl"><Loader type="dots" size="lg" color="blue" /></Center>
        ) : history.length === 0 ? (
          <Alert icon={<IconInfoCircle size={16} />} color="gray">
            Nessuna modifica registrata per questa pagina.
          </Alert>
        ) : (
          <Stack gap="xs">
            {history.map((entry) => (
              <Paper key={entry.id} p="sm" withBorder radius="sm">
                <Group justify="space-between" mb={4}>
                  <Badge
                    size="sm"
                    color={
                      entry.action === 'create' ? 'green' :
                      entry.action === 'update' ? 'blue' :
                      entry.action === 'delete' ? 'red' :
                      entry.action === 'reorder' ? 'orange' : 'gray'
                    }
                  >
                    {entry.action === 'create' ? 'Creazione' :
                     entry.action === 'update' ? 'Modifica' :
                     entry.action === 'delete' ? 'Eliminazione' :
                     entry.action === 'reorder' ? 'Riordino' : entry.action}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {new Date(entry.created_at).toLocaleString('it-IT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Group>
                <Text size="sm">{entry.description}</Text>
              </Paper>
            ))}
          </Stack>
        )}
      </Drawer>
    </Box>
  );
}
