'use client';

import { useState } from 'react';
import {
  Stack,
  Group,
  TextInput,
  Textarea,
  Button,
  Paper,
  ActionIcon,
  Text,
  Image,
  Box,
} from '@mantine/core';
import { IconTrash, IconPlus, IconArrowUp, IconArrowDown, IconPhoto, IconFolderOpen } from '@tabler/icons-react';

interface CardData {
  title: string;
  description: string;
  image: string;
}

interface ScrollCardsEditorProps {
  value: string; // JSON string
  onChange: (value: string) => void;
  onOpenAssetPicker: (callback: (url: string) => void) => void;
}

const DEFAULT_CARD: CardData = {
  title: '',
  description: '',
  image: '',
};

export default function ScrollCardsEditor({ value, onChange, onOpenAssetPicker }: ScrollCardsEditorProps) {
  // Parse JSON or use empty array
  let cards: CardData[] = [];
  try {
    if (value) cards = JSON.parse(value);
  } catch {
    cards = [];
  }

  const updateCards = (newCards: CardData[]) => {
    onChange(JSON.stringify(newCards));
  };

  const addCard = () => {
    updateCards([...cards, { ...DEFAULT_CARD }]);
  };

  const removeCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index);
    updateCards(newCards);
  };

  const updateCard = (index: number, field: keyof CardData, fieldValue: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: fieldValue };
    updateCards(newCards);
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const newCards = [...cards];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCards.length) return;
    [newCards[index], newCards[targetIndex]] = [newCards[targetIndex], newCards[index]];
    updateCards(newCards);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" fw={500}>Cards ({cards.length})</Text>
        <Button size="xs" leftSection={<IconPlus size={14} />} onClick={addCard}>
          Aggiungi Card
        </Button>
      </Group>

      {cards.length === 0 ? (
        <Paper p="md" withBorder ta="center">
          <Text size="sm" c="dimmed">Nessuna card. Clicca "Aggiungi Card" per iniziare.</Text>
        </Paper>
      ) : (
        <Stack gap="sm">
          {cards.map((card, index) => (
            <Paper key={index} p="sm" withBorder radius="sm">
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={500} c="dimmed">Card #{index + 1}</Text>
                <Group gap={4}>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => moveCard(index, 'up')}
                    disabled={index === 0}
                  >
                    <IconArrowUp size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => moveCard(index, 'down')}
                    disabled={index === cards.length - 1}
                  >
                    <IconArrowDown size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => removeCard(index)}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                </Group>
              </Group>

              <Stack gap="xs">
                <TextInput
                  label="Titolo"
                  placeholder="Es: Prima consulenza"
                  value={card.title}
                  onChange={(e) => updateCard(index, 'title', e.target.value)}
                  size="xs"
                />
                <Textarea
                  label="Descrizione"
                  placeholder="Es: per conoscerci<br/> e comprendere la tua visione."
                  value={card.description}
                  onChange={(e) => updateCard(index, 'description', e.target.value)}
                  size="xs"
                  minRows={2}
                />
                <Group gap="xs" align="flex-end">
                  <TextInput
                    label="Immagine"
                    placeholder="URL immagine"
                    value={card.image}
                    onChange={(e) => updateCard(index, 'image', e.target.value)}
                    size="xs"
                    style={{ flex: 1 }}
                    leftSection={<IconPhoto size={12} />}
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="subtle"
                        onClick={() => onOpenAssetPicker((url) => updateCard(index, 'image', url))}
                      >
                        <IconFolderOpen size={12} />
                      </ActionIcon>
                    }
                  />
                  {card.image && (
                    <Box w={40} h={40}>
                      <Image
                        src={card.image}
                        alt="preview"
                        w={40}
                        h={40}
                        fit="cover"
                        radius="sm"
                      />
                    </Box>
                  )}
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
