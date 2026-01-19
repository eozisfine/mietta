'use client';
import { Container, SimpleGrid, Stack, Title, Text, Button, Box } from "@mantine/core";
import Link from "next/link";

interface Column {
  title: string;
  text: string;
  links?: Array<{ label: string; href: string }>;
}

interface ThreeColumnsTextProps {
  title?: string; // JSON stringificato con le 3 colonne
  text?: string;  // Non usato, per compatibilità
}

const DEFAULT_COLUMNS: Column[] = [
  {
    title: 'Chi sono',
    text: 'Sono nata a Milano, mi sono laureata in Architettura al Politecnico e poi diplomata in Scenografia all\'Accademia di Brera. Per nove anni sono stata assistente di Pierluigi Pieralli.',
    links: [{ label: 'BIOGRAFIA', href: '/biografia' }]
  },
  {
    title: 'Il mio lavoro',
    text: 'Lavoro come regista e scenografa nell\'ambito del teatro lirico e musicale contemporaneo. Uno degli aspetti per me più appassionanti della mia ricerca è l\'uso del video, un linguaggio che dovrebbe stare in uno stretto rapporto con la musica e la drammaturgia.',
    links: [
      { label: 'OPERE', href: '/opera' },
      { label: 'PRODUZIONI VIDEO', href: '/produzioni-video' }
    ]
  },
  {
    title: 'Il mio processo creativo',
    text: 'Oltre alla lirica, mi piace molto lavorare a nuovi progetti "cross over" dove vari linguaggi possano fondersi. Ed anche progettare installazioni video e realizzare video clips, facendo ateliers artistici con gli allievi del CFPTS a Parigi.',
    links: [{ label: 'INSEGNAMENTO', href: '/insegnamento' }]
  }
];

export default function ThreeColumnsText({ title }: ThreeColumnsTextProps) {
  let columns = DEFAULT_COLUMNS;

  try {
    if (title) columns = JSON.parse(title);
  } catch (e) {
    // usa default se parsing fallisce
  }

  return (
    <Box py={{ base: 60, md: 120 }} px={{ base: 'md', md: 'xl' }} bg="white">
      <Container size="xl">
        <SimpleGrid
          cols={{ base: 1, md: 3 }}
          spacing={{ base: 40, md: 0 }}
        >
          {columns.map((col, index) => (
            <Stack
              key={index}
              align="center"
              gap="lg"
              px={{ base: 'md', md: 'xl' }}
              style={{
                borderRight: index < 2 ? '1px solid #000' : 'none',
                borderRightWidth: index < 2 ? 1 : 0,
              }}
              styles={{
                root: {
                  '@media (max-width: 768px)': {
                    borderRight: 'none !important',
                  }
                }
              }}
            >
              <Title
                order={2}
                ta="center"
                style={{
                  fontFamily: 'var(--font-title), Buda, serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  letterSpacing: '5px',
                  textTransform: 'uppercase'
                }}
              >
                {col.title}
              </Title>

              <Text
                ta="center"
                size="lg"
                style={{
                  fontFamily: 'var(--font-title), Buda, serif',
                  lineHeight: 1.6,
                  maxWidth: '350px'
                }}
              >
                {col.text}
              </Text>

              <Stack gap="xs" align="center">
                {col.links?.map((link, linkIndex) => (
                  <Button
                    key={linkIndex}
                    component={Link}
                    href={link.href}
                    variant="transparent"
                    color="dark"
                    rightSection={<span style={{ marginLeft: 8 }}>→</span>}
                    styles={{
                      root: {
                        fontFamily: 'var(--font-body), Fira Mono, monospace',
                        fontSize: '14px',
                        fontWeight: 400,
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        padding: '10px 20px',
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
