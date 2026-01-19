import {
  Button,
  Divider,
  Flex,
  Image,
  Overlay,
  Stack,
  Title
} from '@mantine/core';
import Link from 'next/link';
import classes from '@/app/sectionOne.module.css';

interface ProjectShowcaseProps {
  title?: string;
  text?: string; // 'left' | 'right' - posizione immagine nel layout desktop
  image?: string;
  href?: string;
}

export default function ProjectShowcase({ title, text = 'right', image, href }: ProjectShowcaseProps) {
  const imagePosition = text === 'left' ? 'left' : 'right';
  const linkHref = href || '/';

  return (
    <>
      {/* Hero mobile con overlay */}
      <Flex
        direction="column"
        gap={'md'}
        className={classes.hero}
        align={'center'}
        justify={'center'}
        style={{
          height: '50vh',
          backgroundImage: `url(${image})`,
        }}
      >
        <Overlay opacity={0.7} zIndex={1} />
        <Title
          style={{ zIndex: 2 }}
          ta={'center'}
          c={'white'}
          order={2}
          dangerouslySetInnerHTML={{ __html: title || '' }}
        />
        <Button
          component={Link}
          style={{ zIndex: 2 }}
          size={'lg'}
          radius={'xl'}
          color={'#7E8470'}
          href={linkHref}
        >
          Guarda il progetto
        </Button>
      </Flex>

      {/* Layout desktop */}
      <Flex
        justify={'center'}
        align={'center'}
        visibleFrom={'md'}
        bg={'#E9E7E4'}
        mb={imagePosition === 'left' ? 120 : 0}
      >
        {imagePosition === 'left' && (
          <Image
            flex={1}
            maw={'50%'}
            src={image}
            alt={title || 'Progetto'}
          />
        )}
        <Flex flex={1} m={'8%'}>
          <Stack>
            <Title
              ta={imagePosition === 'left' ? 'right' : 'left'}
              order={2}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
            <Divider
              style={{ borderColor: 'black' }}
              w={'140%'}
              ml={imagePosition === 'left' ? '-40%' : 0}
            />
            <Button
              variant={'outline'}
              component={Link}
              color={'black'}
              href={linkHref}
            >
              Guarda il progetto
            </Button>
          </Stack>
        </Flex>
        {imagePosition === 'right' && (
          <Image
            flex={1}
            maw={'50%'}
            src={image}
            alt={title || 'Progetto'}
          />
        )}
      </Flex>
    </>
  );
}
