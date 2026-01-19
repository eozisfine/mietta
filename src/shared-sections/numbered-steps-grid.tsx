'use client';
import {
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Title
} from '@mantine/core';

interface Step {
  number: string;
  title?: string;
  text?: string;
  bgColor: string;
  borderColor: string;
  position?: number; // 0-8 for 3x3 grid
}

interface NumberedStepsGridProps {
  title?: string; // JSON array of steps
}

const DEFAULT_STEPS: Step[] = [
  { number: '1', text: 'Analisi delle esigenze<br/>e sopralluogo', bgColor: '#F2F2F2', borderColor: '#848189', position: 0 },
  { number: '2', text: 'Studio degli spazi<br/>proposta progettuale<br/>con render dedicato', bgColor: '#E9E7E4', borderColor: '#5C5449', position: 4 },
  { number: '3', text: 'Realizzazione e montaggio<br/>affidato esclusivamente<br/>al nostro team interno', bgColor: '#F2F2F2', borderColor: '#5C5449', position: 8 },
];

export default function NumberedStepsGrid({ title }: NumberedStepsGridProps) {
  const HEIGHT = 250;

  let steps = DEFAULT_STEPS;
  try {
    if (title) steps = JSON.parse(title);
  } catch (e) {
    // usa default
  }

  // Crea una griglia 3x3
  // Se position non è definito, usa posizioni default: 0, 4, 8 (diagonale)
  const defaultPositions = [0, 4, 8];
  const grid = Array(9).fill(null);
  steps.forEach((step, idx) => {
    const pos = step.position !== undefined ? step.position : defaultPositions[idx];
    grid[pos] = step;
  });

  return (
    <div style={{
      overflow: 'visible',
      position: 'relative',
      marginTop: -15,
      marginBottom: 15,
    }}>
      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        spacing={0}
        style={{
          gridAutoRows: '1fr'
        }}
      >
        {grid.map((step, index) => {
          if (!step) {
            return <Paper key={index} radius={0} />;
          }

          return (
            <Paper
              key={index}
              bg={step.bgColor}
              withBorder
              radius={0}
              style={{
                position: 'sticky',
                top: 150,
                borderColor: step.borderColor,
                zIndex: index === 8 ? 4 : undefined,
                display: 'flex',
              }}
            >
              <Flex
                direction={'column'}
                align={'center'}
                justify={'center'}
                p={'xl'}
                style={{ width: '100%' }}
              >
                <Group wrap="nowrap" align="center">
                  <Title size={70} c={'#848189'} style={{ flexShrink: 0 }}>{step.number}</Title>
                  <Title
                    order={3}
                    c={'#848189'}
                    dangerouslySetInnerHTML={{ __html: step.title || step.text || '' }}
                  />
                </Group>
              </Flex>
            </Paper>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
