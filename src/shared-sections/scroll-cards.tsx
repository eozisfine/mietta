'use client';

import {
  Card,
  Container,
  Divider,
  Flex,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';

interface CardData {
  title: string;
  description: string;
  image: string;
}

interface ScrollCardsProps {
  title?: string; // JSON array of cards
}

const DEFAULT_CARDS: CardData[] = [
  {
    title: 'Prima consulenza',
    description: 'per conoscerci<br/> e comprendere la tua visione.',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/DSC06594.jpg',
  },
  {
    title: 'Sopralluogo tecnico',
    description: 'analisi degli spazi<br/>(su richiesta).',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/P1009980.jpg',
  },
  {
    title: 'Seconda consulenza',
    description: 'Idea iniziale e render digitale dedicato.',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/SassiArr-0177.jpg',
  },
  {
    title: 'Render',
    description: 'Così puoi vedere la tua casa<br/>prima ancora di vederla costruita.',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/SassiArr-0273.jpg',
  },
  {
    title: 'Realizzazione',
    description: 'A cura esclusiva del nostro team.',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/SassiArr-0510.jpg',
  },
  {
    title: 'Fine lavori',
    description: 'Pronto per voi!',
    image: 'https://ydiesod80lkhbzph.public.blob.vercel-storage.com/DSC07144.jpg',
  },
];

export default function ScrollCards({ title }: ScrollCardsProps) {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const cardRefs = useRef<any[]>([]);

  // Parse cards from JSON or use defaults
  let cards: CardData[] = DEFAULT_CARDS;
  if (title) {
    try {
      cards = JSON.parse(title);
    } catch {
      // Use default cards if parsing fails
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.findIndex((ref) => ref === entry.target);
          if (entry.isIntersecting) {
            setActiveCard(index);
          } else {
            setActiveCard((current) => current === index ? null : current);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '-48% 0px -48% 0px'
      }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [cards.length]);

  return (
    <div>
      <Container size={'xl'}>
        <Stack mt={90} mb={90}>
          {cards.map((card, index) => (
            <Card
              key={index}
              ref={(el: any) => (cardRefs.current[index] = el)}
              bg={activeCard === index ? '#7E8470' : '#D3C9B8'}
              radius={'md'}
              p={'lg'}
              style={{
                width: activeCard === index ? '100%' : '90%',
                transition: 'all 0.3s ease'
              }}
              ml={'auto'}
            >
              <Flex align={'center'} justify={'space-between'} gap={'xl'}>
                <Title
                  w={activeCard === index ? 50 : 300}
                  c={activeCard === index ? 'white' : '#5C5449'}
                >
                  {index + 1}
                </Title>
                <Flex direction={'column'} flex={1}>
                  <Stack gap={'xs'}>
                    <Title
                      c={activeCard === index ? 'white' : '#5C5449'}
                      order={2}
                    >
                      {card.title}
                    </Title>
                    <Divider
                      style={{ borderColor: activeCard === index ? 'white' : '#5C5449' }}
                    />
                    <Text
                      c={activeCard === index ? 'white' : '#5C5449'}
                      dangerouslySetInnerHTML={{ __html: card.description }}
                    />
                  </Stack>
                </Flex>
                {activeCard === index && (
                  <Image
                    src={card.image}
                    visibleFrom={'md'}
                    maw={700}
                    mt={'-lg'}
                    mb={'-lg'}
                    mr={'-lg'}
                    alt={`image-${index}`}
                  />
                )}
              </Flex>
            </Card>
          ))}
        </Stack>
      </Container>
    </div>
  );
}
