'use client';

import {
  Stack,
  Group,
  TextInput,
  NumberInput,
  Button,
  Paper,
  ActionIcon,
  Text,
  Image,
  Box,
  SimpleGrid,
} from '@mantine/core';
import { IconTrash, IconPlus, IconPhoto, IconFolderOpen } from '@tabler/icons-react';

interface Photo {
  src: string;
  width: number;
  height: number;
}

interface PhotoGalleryEditorProps {
  value: string; // JSON string
  onChange: (value: string) => void;
  onOpenAssetPicker: (callback: (url: string) => void) => void;
}

const DEFAULT_PHOTO: Photo = {
  src: '',
  width: 800,
  height: 600,
};

export default function PhotoGalleryEditor({ value, onChange, onOpenAssetPicker }: PhotoGalleryEditorProps) {
  let photos: Photo[] = [];
  try {
    if (value) photos = JSON.parse(value);
  } catch {
    photos = [];
  }

  const updatePhotos = (newPhotos: Photo[]) => {
    onChange(JSON.stringify(newPhotos));
  };

  const addPhoto = () => {
    updatePhotos([...photos, { ...DEFAULT_PHOTO }]);
  };

  const addPhotoWithUrl = (url: string) => {
    updatePhotos([...photos, { src: url, width: 800, height: 600 }]);
  };

  const removePhoto = (index: number) => {
    updatePhotos(photos.filter((_, i) => i !== index));
  };

  const updatePhoto = (index: number, field: keyof Photo, fieldValue: string | number) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], [field]: fieldValue };
    updatePhotos(newPhotos);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" fw={500}>Foto ({photos.length})</Text>
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            leftSection={<IconFolderOpen size={14} />}
            onClick={() => onOpenAssetPicker(addPhotoWithUrl)}
          >
            Da Assets
          </Button>
          <Button size="xs" leftSection={<IconPlus size={14} />} onClick={addPhoto}>
            Aggiungi
          </Button>
        </Group>
      </Group>

      {photos.length === 0 ? (
        <Paper p="md" withBorder ta="center">
          <Text size="sm" c="dimmed">Nessuna foto. Clicca "Aggiungi" o "Da Assets" per iniziare.</Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          {photos.map((photo, index) => (
            <Paper key={index} p="xs" withBorder radius="sm">
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={500} c="dimmed">Foto #{index + 1}</Text>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="red"
                  onClick={() => removePhoto(index)}
                >
                  <IconTrash size={12} />
                </ActionIcon>
              </Group>

              {photo.src && (
                <Box mb="xs">
                  <Image
                    src={photo.src}
                    alt={`foto-${index}`}
                    h={80}
                    fit="cover"
                    radius="sm"
                  />
                </Box>
              )}

              <Stack gap={4}>
                <TextInput
                  placeholder="URL immagine"
                  value={photo.src}
                  onChange={(e) => updatePhoto(index, 'src', e.target.value)}
                  size="xs"
                  leftSection={<IconPhoto size={12} />}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      onClick={() => onOpenAssetPicker((url) => updatePhoto(index, 'src', url))}
                    >
                      <IconFolderOpen size={12} />
                    </ActionIcon>
                  }
                />
                <Group grow>
                  <NumberInput
                    placeholder="Larghezza"
                    value={photo.width}
                    onChange={(val) => updatePhoto(index, 'width', Number(val))}
                    size="xs"
                    min={100}
                    max={4000}
                  />
                  <NumberInput
                    placeholder="Altezza"
                    value={photo.height}
                    onChange={(val) => updatePhoto(index, 'height', Number(val))}
                    size="xs"
                    min={100}
                    max={4000}
                  />
                </Group>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
