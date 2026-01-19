'use client';

import {
  Stack,
  Group,
  TextInput,
  Textarea,
  Button,
  Paper,
  ActionIcon,
  Text,
  ColorInput,
  Select,
} from '@mantine/core';
import { IconTrash, IconPlus, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

interface Step {
  number: string;
  text: string;
  bgColor: string;
  borderColor: string;
  position: number;
}

interface NumberedStepsEditorProps {
  value: string; // JSON string
  onChange: (value: string) => void;
}

const DEFAULT_STEP: Step = {
  number: '',
  text: '',
  bgColor: '#F2F2F2',
  borderColor: '#848189',
  position: 0,
};

const POSITION_OPTIONS = [
  { value: '0', label: 'Riga 1, Col 1' },
  { value: '1', label: 'Riga 1, Col 2' },
  { value: '2', label: 'Riga 1, Col 3' },
  { value: '3', label: 'Riga 2, Col 1' },
  { value: '4', label: 'Riga 2, Col 2 (centro)' },
  { value: '5', label: 'Riga 2, Col 3' },
  { value: '6', label: 'Riga 3, Col 1' },
  { value: '7', label: 'Riga 3, Col 2' },
  { value: '8', label: 'Riga 3, Col 3' },
];

export default function NumberedStepsEditor({ value, onChange }: NumberedStepsEditorProps) {
  let steps: Step[] = [];
  try {
    if (value) steps = JSON.parse(value);
  } catch {
    steps = [];
  }

  const updateSteps = (newSteps: Step[]) => {
    onChange(JSON.stringify(newSteps));
  };

  const addStep = () => {
    const usedPositions = steps.map(s => s.position);
    const nextPosition = [0, 4, 8, 1, 2, 3, 5, 6, 7].find(p => !usedPositions.includes(p)) || 0;
    const newStep = {
      ...DEFAULT_STEP,
      number: String(steps.length + 1),
      position: nextPosition,
    };
    updateSteps([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    updateSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof Step, fieldValue: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: fieldValue };
    updateSteps(newSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    updateSteps(newSteps);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" fw={500}>Passi ({steps.length}/9 max)</Text>
        <Button
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={addStep}
          disabled={steps.length >= 9}
        >
          Aggiungi Passo
        </Button>
      </Group>

      {steps.length === 0 ? (
        <Paper p="md" withBorder ta="center">
          <Text size="sm" c="dimmed">Nessun passo. Clicca "Aggiungi Passo" per iniziare.</Text>
        </Paper>
      ) : (
        <Stack gap="sm">
          {steps.map((step, index) => (
            <Paper key={index} p="sm" withBorder radius="sm">
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={500} c="dimmed">Passo #{index + 1}</Text>
                <Group gap={4}>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                  >
                    <IconArrowUp size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === steps.length - 1}
                  >
                    <IconArrowDown size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => removeStep(index)}
                  >
                    <IconTrash size={12} />
                  </ActionIcon>
                </Group>
              </Group>

              <Stack gap="xs">
                <Group grow>
                  <TextInput
                    label="Numero"
                    placeholder="Es: 1"
                    value={step.number}
                    onChange={(e) => updateStep(index, 'number', e.target.value)}
                    size="xs"
                  />
                  <Select
                    label="Posizione nella griglia"
                    data={POSITION_OPTIONS}
                    value={String(step.position)}
                    onChange={(val) => updateStep(index, 'position', Number(val))}
                    size="xs"
                  />
                </Group>
                <Textarea
                  label="Testo"
                  placeholder="Es: Analisi delle esigenze<br/>e sopralluogo"
                  value={step.text}
                  onChange={(e) => updateStep(index, 'text', e.target.value)}
                  size="xs"
                  minRows={2}
                />
                <Group grow>
                  <ColorInput
                    label="Colore sfondo"
                    value={step.bgColor}
                    onChange={(val) => updateStep(index, 'bgColor', val)}
                    size="xs"
                  />
                  <ColorInput
                    label="Colore bordo"
                    value={step.borderColor}
                    onChange={(val) => updateStep(index, 'borderColor', val)}
                    size="xs"
                  />
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
