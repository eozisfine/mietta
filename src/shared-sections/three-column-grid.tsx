'use client'
import { Button, Divider, Flex, Paper, SimpleGrid, Title } from "@mantine/core";
import Link from "next/link";
import HeroImageCenter from "@/shared-sections/hero-image-center";

interface GridItem {
  type: 'empty' | 'image' | 'cta';
  image?: string;
  title?: string;
  href?: string;
  bgColor?: string;
  textColor?: string;
  buttonText?: string;
}

interface ThreeColumnGridProps {
  // Per compatibilità con il builder, usiamo un JSON stringificato
  // oppure props separate per i 6 elementi della griglia
  title?: string;  // JSON con la configurazione della griglia
  text?: string;   // JSON con items mobile (HeroImageCenter)
}

// Configurazione di default per la homepage
const DEFAULT_DESKTOP_ITEMS: GridItem[] = [
  { type: 'empty' },
  { type: 'image', image: '/cmg.png' },
  {
    type: 'cta',
    title: 'I nostri<br/>progetti',
    href: '/progetti',
    bgColor: '#E9E7E4',
    textColor: '#5C5449',
    buttonText: 'SCOPRI DI PIÙ'
  },
  {
    type: 'image',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/prog-insieme.webp'
  },
  {
    type: 'cta',
    title: 'Prenota una<br/>consulenza',
    href: '/contatti',
    bgColor: '#7E8470',
    textColor: 'white',
    buttonText: 'INIZIAMO DA QUI'
  },
  { type: 'empty' },
];

const DEFAULT_MOBILE_ITEMS = [
  {
    title: 'La nostra filosofia',
    href: '/filosofia',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/SassiArr-0758%20%282%29.png'
  },
  {
    title: 'I nostri progetti',
    href: '/progetti',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/Casa%20Magazeo%2015MAG253420.jpg'
  },
  {
    title: 'Prenota una consulenza',
    href: '/contatti',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/SassiArr-0308.jpg'
  },
];

export default function ThreeColumnGrid({ title, text }: ThreeColumnGridProps) {
  // Parse JSON se fornito, altrimenti usa default
  let desktopItems = DEFAULT_DESKTOP_ITEMS;
  let mobileItems = DEFAULT_MOBILE_ITEMS;

  try {
    if ( title ) desktopItems = JSON.parse(title);
    if ( text ) mobileItems = JSON.parse(text);
  } catch ( e ) {
    // usa default se il parsing fallisce
  }

  return (
      <div style={{
        overflow: 'visible',
        position: 'relative',
        inset: 'top',
        marginTop: -15,
        marginBottom: 15,
      }}>
        {/* Desktop: Griglia 3 colonne */}
        <SimpleGrid cols={3} spacing={0} style={{ alignItems: 'start' }}
                    visibleFrom={'md'}>
          {desktopItems.map((item, index) => {
            if ( item.type === 'empty' ) {
              return <Paper key={index} radius={0} mih={500}/>;
            }

            if ( item.type === 'image' ) {
              return (
                  <Paper
                      key={index}
                      radius={0}
                      mih={500}
                      style={{
                        background: `url(${item.image}) no-repeat center center`,
                        backgroundSize: 'cover',
                        position: index === 1 ? 'sticky' : 'initial',
                        top: index === 1 ? 150 : 0,
                        zIndex: index === 1 ? 1 : 2
                      }}
                  />
              );
            }

            if ( item.type === 'cta' ) {
              return (
                  <Paper
                      key={index}
                      bg={item.bgColor}
                      radius={0}
                      style={index === 2 ? {
                        position: 'sticky',
                        top: 150,
                        zIndex: 1
                      } : {
                        zIndex: 2
                      }}
                  >
                    <Flex
                        direction={'column'}
                        align={'flex-start'}
                        justify={'flex-end'}
                        p={'xl'}
                        mih={500}
                    >
                      <Title
                          order={2}
                          size="h2"
                          c={item.textColor}
                          dangerouslySetInnerHTML={{ __html: item.title || '' }}
                      />
                      <Divider
                          mt={'md'}
                          mb={'md'}
                          size={'1'}
                          style={{ width: '60%', borderColor: item.textColor }}
                      />
                      <Button
                          radius={'xl'}
                          component={Link}
                          href={item.href || '#'}
                          variant={'outline'}
                          color={item.textColor}
                      >
                        {item.buttonText || 'SCOPRI DI PIÙ'}
                      </Button>
                    </Flex>
                  </Paper>
              );
            }

            return null;
          })}
        </SimpleGrid>

        {/* Mobile: Stack di HeroImageCenter */}
        <Flex direction={'column'} hiddenFrom={'md'}>
          {mobileItems.map((item, index) => (
              <HeroImageCenter
                  key={index}
                  title={item.title}
                  href={item.href}
                  image={item.image}
              />
          ))}
        </Flex>
      </div>
  );
}
