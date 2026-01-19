'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Tabs,
  Paper,
  List,
  Code,
  Alert,
  Group,
  Badge,
  ThemeIcon,
  ActionIcon,
  Divider,
} from '@mantine/core';
import {
  IconFiles,
  IconPlus,
  IconArrowUp,
  IconArrowDown,
  IconEdit,
  IconTrash,
  IconEye,
  IconHistory,
  IconInfoCircle,
  IconArrowLeft,
  IconSettings,
  IconDeviceMobile,
  IconPhoto,
} from '@tabler/icons-react';
import Link from 'next/link';

export default function PageBuilderGuidePage() {
  return (
    <Container size="md" py="xl">
      <Group gap="xs" mb="lg">
        <ActionIcon variant="subtle" component={Link} href="/admin/guide" size="sm">
          <IconArrowLeft size={16} />
        </ActionIcon>
        <ThemeIcon size="lg" variant="light" color="blue">
          <IconFiles size={20} />
        </ThemeIcon>
        <Title order={3}>Page Builder</Title>
      </Group>

      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab value="overview">Panoramica</Tabs.Tab>
          <Tabs.Tab value="sections">Sezioni</Tabs.Tab>
          <Tabs.Tab value="advanced">Avanzate v1.1</Tabs.Tab>
          <Tabs.Tab value="history">Cronologia</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Stack gap="md">
            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Cos'è il Page Builder?</Text>
              <Text size="sm" c="dimmed">
                Il Page Builder ti permette di creare pagine dinamiche componendo diverse sezioni.
                Ogni pagina può avere un numero illimitato di sezioni che puoi riordinare,
                modificare o eliminare in qualsiasi momento.
              </Text>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Categorie di pagine</Text>
              <List size="sm" spacing="xs">
                <List.Item>
                  <Code>static-page</Code> - Pagine statiche accessibili da <Code>/slug</Code>
                </List.Item>
                <List.Item>
                  <Code>evento</Code> - Pagine evento accessibili da <Code>/eventi/slug</Code>
                </List.Item>
                <List.Item>
                  <Code>vetrina</Code> - Pagine vetrina per progetti
                </List.Item>
              </List>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Toolbar sezioni</Text>
              <Text size="sm" c="dimmed" mb="sm">
                Sotto ogni sezione trovi una toolbar con le seguenti azioni:
              </Text>
              <Group gap="xs">
                <Badge leftSection={<IconArrowUp size={12} />} variant="light" color="gray">Sposta su</Badge>
                <Badge leftSection={<IconArrowDown size={12} />} variant="light" color="gray">Sposta giù</Badge>
                <Badge leftSection={<IconEdit size={12} />} variant="light" color="blue">Modifica</Badge>
                <Badge leftSection={<IconTrash size={12} />} variant="light" color="red">Elimina</Badge>
              </Group>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Header della pagina</Text>
              <Group gap="xs">
                <Badge leftSection={<IconEye size={12} />} variant="light">Anteprima</Badge>
                <Badge leftSection={<IconHistory size={12} />} variant="light">Cronologia</Badge>
                <Badge leftSection={<IconPlus size={12} />} variant="light">Aggiungi sezione</Badge>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="sections">
          <Stack gap="md">
            <Alert icon={<IconInfoCircle size={16} />} color="blue">
              Ogni sezione ha campi specifici. Il form di modifica mostra solo i campi rilevanti per il tipo selezionato.
            </Alert>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Sezioni con immagine full-screen</Text>
              <List size="sm" spacing="xs">
                <List.Item><Code>HeaderImageFull</Code> - Header con immagine a tutto schermo</List.Item>
                <List.Item><Code>HeroImageCenter</Code> - Hero con testo centrato</List.Item>
                <List.Item><Code>ImageBoxRightFullh</Code> - Box testo a destra</List.Item>
                <List.Item><Code>ImageBoxLeftFullh</Code> - Box testo a sinistra</List.Item>
                <List.Item><Code>BannerWithLink</Code> - Banner con link</List.Item>
              </List>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Sezioni di contenuto</Text>
              <List size="sm" spacing="xs">
                <List.Item><Code>TitleLeftTextRight</Code> - Titolo a sinistra, testo a destra</List.Item>
                <List.Item><Code>ImageLeftTextRight</Code> - Immagine a sinistra, testo a destra</List.Item>
                <List.Item><Code>ThreeColumnGrid</Code> - Griglia a 3 colonne configurabile</List.Item>
                <List.Item><Code>NumberedStepsGrid</Code> - Passi numerati</List.Item>
                <List.Item><Code>PhotoGallery</Code> - Galleria fotografica con lightbox</List.Item>
                <List.Item><Code>ScrollCards</Code> - Cards scorrevoli orizzontalmente</List.Item>
              </List>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Sezioni CTA</Text>
              <List size="sm" spacing="xs">
                <List.Item><Code>CtaImageLeft</Code> - Call to action con immagine</List.Item>
                <List.Item><Code>CtaColoredBg</Code> - CTA con sfondo colorato</List.Item>
                <List.Item><Code>InstagramCta</Code> - CTA per Instagram</List.Item>
                <List.Item><Code>SocialCtaCombined</Code> - CTA social combinato</List.Item>
              </List>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Sezioni dinamiche</Text>
              <List size="sm" spacing="xs">
                <List.Item><Code>EventsGrid</Code> - Griglia eventi automatica</List.Item>
                <List.Item><Code>ProjectShowcase</Code> - Showcase progetti</List.Item>
                <List.Item><Code>GoogleMap</Code> - Mappa Google incorporata</List.Item>
              </List>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Formattazione HTML</Text>
              <Text size="sm" c="dimmed" mb="xs">
                I campi titolo e testo supportano tag HTML di base:
              </Text>
              <Code block>
{`<b>grassetto</b>
<i>corsivo</i>
<br/> a capo`}
              </Code>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="advanced">
          <Stack gap="md">
            <Alert icon={<IconSettings size={16} />} color="green" title="Novità v1.1">
              Nuove funzionalità avanzate per un controllo più granulare delle sezioni.
            </Alert>

            <Paper withBorder p="md">
              <Group gap="xs" mb="sm">
                <IconPhoto size={18} />
                <Text fw={500}>Effetto Parallax</Text>
              </Group>
              <Text size="sm" c="dimmed" mb="xs">
                Disponibile per sezioni con immagine di sfondo: HeaderImageFull, HeroImageCenter,
                ImageBoxRightFullh, ImageBoxLeftFullh, BannerWithLink, ImageTextOverlayLeft.
              </Text>
              <Text size="sm">
                Attivando il parallax, lo sfondo rimane fisso mentre il contenuto scorre,
                creando un effetto di profondità.
              </Text>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Controlli Spacing</Text>
              <Text size="sm" c="dimmed" mb="xs">
                Personalizza padding e margin di ogni sezione:
              </Text>
              <List size="sm" spacing="xs">
                <List.Item><Code>Padding Top/Bottom</Code> - Spaziatura interna</List.Item>
                <List.Item><Code>Margin Top/Bottom</Code> - Spaziatura esterna</List.Item>
              </List>
              <Text size="sm" mt="xs">
                Valori disponibili: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
              </Text>
            </Paper>

            <Paper withBorder p="md">
              <Group gap="xs" mb="sm">
                <IconDeviceMobile size={18} />
                <Text fw={500}>Visibilità Responsive</Text>
              </Group>
              <Text size="sm" c="dimmed" mb="xs">
                Mostra o nascondi sezioni in base al breakpoint:
              </Text>
              <List size="sm" spacing="xs">
                <List.Item><Code>Visibile da</Code> - Mostra la sezione solo da quel breakpoint in su</List.Item>
                <List.Item><Code>Nascosto da</Code> - Nascondi la sezione da quel breakpoint in su</List.Item>
              </List>
              <Divider my="sm" />
              <Text size="xs" c="dimmed">
                Breakpoints: xs (&lt;576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px)
              </Text>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Come accedere</Text>
              <Text size="sm" c="dimmed">
                Le opzioni avanzate sono disponibili nel drawer di modifica sezione,
                sotto la sezione "Opzioni avanzate" (clicca per espandere).
              </Text>
            </Paper>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <Stack gap="md">
            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Sistema di cronologia</Text>
              <Text size="sm" c="dimmed">
                Ogni modifica alle sezioni viene registrata automaticamente.
                Puoi accedere alla cronologia cliccando l'icona <IconHistory size={14} style={{ verticalAlign: 'middle' }} /> nell'header della pagina.
              </Text>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="sm">Azioni registrate</Text>
              <Group gap="xs">
                <Badge color="green">Creazione</Badge>
                <Badge color="blue">Modifica</Badge>
                <Badge color="red">Eliminazione</Badge>
                <Badge color="orange">Riordino</Badge>
              </Group>
            </Paper>

            <Paper withBorder p="md">
              <Text fw={500} mb="xs">Informazioni salvate</Text>
              <List size="sm" spacing="xs">
                <List.Item>Data e ora della modifica</List.Item>
                <List.Item>Tipo di azione eseguita</List.Item>
                <List.Item>Descrizione della modifica</List.Item>
                <List.Item>Dati prima e dopo la modifica (per confronto)</List.Item>
              </List>
            </Paper>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
