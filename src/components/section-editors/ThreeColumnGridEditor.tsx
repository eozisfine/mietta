'use client';

import {
  Stack,
  Group,
  TextInput,
  Button,
  Paper,
  ActionIcon,
  Text,
  Select,
  ColorInput,
  Tabs,
  Image,
  Box,
} from '@mantine/core';
import { IconTrash, IconPlus, IconPhoto, IconFolderOpen, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

interface DesktopItem {
  type: 'empty' | 'image' | 'cta';
  image?: string;
  title?: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
}

interface MobileItem {
  title: string;
  href: string;
  image: string;
}

interface ThreeColumnGridEditorProps {
  titleValue: string; // JSON desktop items
  textValue: string;  // JSON mobile items
  onTitleChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onOpenAssetPicker: (callback: (url: string) => void) => void;
}

const TYPE_OPTIONS = [
  { value: 'empty', label: 'Vuoto' },
  { value: 'image', label: 'Immagine' },
  { value: 'cta', label: 'CTA (Call to Action)' },
];

export default function ThreeColumnGridEditor({
  titleValue,
  textValue,
  onTitleChange,
  onTextChange,
  onOpenAssetPicker,
}: ThreeColumnGridEditorProps) {
  // Parse desktop items
  let desktopItems: DesktopItem[] = [];
  try {
    if (titleValue) desktopItems = JSON.parse(titleValue);
  } catch {
    desktopItems = [];
  }

  // Parse mobile items
  let mobileItems: MobileItem[] = [];
  try {
    if (textValue) mobileItems = JSON.parse(textValue);
  } catch {
    mobileItems = [];
  }

  // Desktop handlers
  const updateDesktopItems = (items: DesktopItem[]) => {
    onTitleChange(JSON.stringify(items));
  };

  const addDesktopItem = () => {
    if (desktopItems.length >= 6) return;
    updateDesktopItems([...desktopItems, { type: 'empty' }]);
  };

  const removeDesktopItem = (index: number) => {
    updateDesktopItems(desktopItems.filter((_, i) => i !== index));
  };

  const updateDesktopItem = (index: number, updates: Partial<DesktopItem>) => {
    const newItems = [...desktopItems];
    newItems[index] = { ...newItems[index], ...updates };
    updateDesktopItems(newItems);
  };

  // Mobile handlers
  const updateMobileItems = (items: MobileItem[]) => {
    onTextChange(JSON.stringify(items));
  };

  const addMobileItem = () => {
    updateMobileItems([...mobileItems, { title: '', href: '', image: '' }]);
  };

  const removeMobileItem = (index: number) => {
    updateMobileItems(mobileItems.filter((_, i) => i !== index));
  };

  const updateMobileItem = (index: number, field: keyof MobileItem, value: string) => {
    const newItems = [...mobileItems];
    newItems[index] = { ...newItems[index], [field]: value };
    updateMobileItems(newItems);
  };

  const moveMobileItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...mobileItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    updateMobileItems(newItems);
  };

  return (
    <Tabs defaultValue="desktop">
      <Tabs.List>
        <Tabs.Tab value="desktop">Desktop (6 celle)</Tabs.Tab>
        <Tabs.Tab value="mobile">Mobile</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="desktop" pt="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" fw={500}>Celle griglia ({desktopItems.length}/6)</Text>
            <Button
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={addDesktopItem}
              disabled={desktopItems.length >= 6}
            >
              Aggiungi
            </Button>
          </Group>

          {desktopItems.length === 0 ? (
            <Paper p="md" withBorder ta="center">
              <Text size="sm" c="dimmed">Nessuna cella. Aggiungi celle per creare la griglia 3x2.</Text>
            </Paper>
          ) : (
            <Stack gap="sm">
              {desktopItems.map((item, index) => (
                <Paper key={index} p="sm" withBorder radius="sm">
                  <Group justify="space-between" mb="xs">
                    <Text size="xs" fw={500} c="dimmed">
                      Cella #{index + 1} (Riga {Math.floor(index / 3) + 1}, Col {(index % 3) + 1})
                    </Text>
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      color="red"
                      onClick={() => removeDesktopItem(index)}
                    >
                      <IconTrash size={12} />
                    </ActionIcon>
                  </Group>

                  <Stack gap="xs">
                    <Select
                      label="Tipo"
                      data={TYPE_OPTIONS}
                      value={item.type}
                      onChange={(val) => updateDesktopItem(index, { type: val as any })}
                      size="xs"
                    />

                    {item.type === 'image' && (
                      <Group gap="xs" align="flex-end">
                        <TextInput
                          label="Immagine"
                          placeholder="URL immagine"
                          value={item.image || ''}
                          onChange={(e) => updateDesktopItem(index, { image: e.target.value })}
                          size="xs"
                          style={{ flex: 1 }}
                          leftSection={<IconPhoto size={12} />}
                          rightSection={
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              onClick={() => onOpenAssetPicker((url) => updateDesktopItem(index, { image: url }))}
                            >
                              <IconFolderOpen size={12} />
                            </ActionIcon>
                          }
                        />
                        {item.image && (
                          <Box w={40} h={40}>
                            <Image src={item.image} alt="preview" w={40} h={40} fit="cover" radius="sm" />
                          </Box>
                        )}
                      </Group>
                    )}

                    {item.type === 'cta' && (
                      <>
                        <TextInput
                          label="Titolo"
                          placeholder="Es: I nostri<br/>progetti"
                          value={item.title || ''}
                          onChange={(e) => updateDesktopItem(index, { title: e.target.value })}
                          size="xs"
                        />
                        <TextInput
                          label="Link"
                          placeholder="Es: /progetti"
                          value={item.href || ''}
                          onChange={(e) => updateDesktopItem(index, { href: e.target.value })}
                          size="xs"
                        />
                        <TextInput
                          label="Testo bottone"
                          placeholder="Es: SCOPRI DI PIÙ"
                          value={item.buttonText || ''}
                          onChange={(e) => updateDesktopItem(index, { buttonText: e.target.value })}
                          size="xs"
                        />
                        <Group grow>
                          <ColorInput
                            label="Sfondo"
                            value={item.bgColor || '#E9E7E4'}
                            onChange={(val) => updateDesktopItem(index, { bgColor: val })}
                            size="xs"
                          />
                          <ColorInput
                            label="Testo"
                            value={item.textColor || '#5C5449'}
                            onChange={(val) => updateDesktopItem(index, { textColor: val })}
                            size="xs"
                          />
                        </Group>
                      </>
                    )}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="mobile" pt="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" fw={500}>Items Mobile ({mobileItems.length})</Text>
            <Button size="xs" leftSection={<IconPlus size={14} />} onClick={addMobileItem}>
              Aggiungi
            </Button>
          </Group>

          {mobileItems.length === 0 ? (
            <Paper p="md" withBorder ta="center">
              <Text size="sm" c="dimmed">Nessun item mobile.</Text>
            </Paper>
          ) : (
            <Stack gap="sm">
              {mobileItems.map((item, index) => (
                <Paper key={index} p="sm" withBorder radius="sm">
                  <Group justify="space-between" mb="xs">
                    <Text size="xs" fw={500} c="dimmed">Item #{index + 1}</Text>
                    <Group gap={4}>
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        onClick={() => moveMobileItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <IconArrowUp size={12} />
                      </ActionIcon>
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        onClick={() => moveMobileItem(index, 'down')}
                        disabled={index === mobileItems.length - 1}
                      >
                        <IconArrowDown size={12} />
                      </ActionIcon>
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => removeMobileItem(index)}
                      >
                        <IconTrash size={12} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Stack gap="xs">
                    <TextInput
                      label="Titolo"
                      placeholder="Es: La nostra filosofia"
                      value={item.title}
                      onChange={(e) => updateMobileItem(index, 'title', e.target.value)}
                      size="xs"
                    />
                    <TextInput
                      label="Link"
                      placeholder="Es: /filosofia"
                      value={item.href}
                      onChange={(e) => updateMobileItem(index, 'href', e.target.value)}
                      size="xs"
                    />
                    <Group gap="xs" align="flex-end">
                      <TextInput
                        label="Immagine"
                        placeholder="URL immagine"
                        value={item.image}
                        onChange={(e) => updateMobileItem(index, 'image', e.target.value)}
                        size="xs"
                        style={{ flex: 1 }}
                        leftSection={<IconPhoto size={12} />}
                        rightSection={
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            onClick={() => onOpenAssetPicker((url) => updateMobileItem(index, 'image', url))}
                          >
                            <IconFolderOpen size={12} />
                          </ActionIcon>
                        }
                      />
                      {item.image && (
                        <Box w={40} h={40}>
                          <Image src={item.image} alt="preview" w={40} h={40} fit="cover" radius="sm" />
                        </Box>
                      )}
                    </Group>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}
