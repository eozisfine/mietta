import { Container, Flex, Image, Stack, Text, Title } from '@mantine/core';

interface SocialCtaCombinedProps {
  title?: string;
  text?: string; // username
  image?: string;
}

export default function SocialCtaCombined({ title, text, image }: SocialCtaCombinedProps) {
  return (
    <div>
      {/* Mobile CTA Instagram */}
      <Container hiddenFrom={'md'} p={40} bg={'#F2F2F2'}>
        <Flex direction="column" gap={'md'}>
          <Title
            ta={'center'}
            order={2}
            dangerouslySetInnerHTML={{ __html: 'Scopri i nostri<br/>ultimi progetti!' }}
          />
          <Image src={'/instagram.png'} w={100} m={'auto'} alt="Instagram" />
          <Text ta={'center'}>{text || '@sassiarredamenti'}</Text>
        </Flex>
      </Container>

      {/* Desktop Social Banner */}
      <Container fluid visibleFrom={'md'}>
        <Stack mt={90} mb={90}>
          <Title
            ta="center"
            order={2}
            dangerouslySetInnerHTML={{ __html: title || 'Seguici sui social<br/>e lasciati ispirare ogni giorno.' }}
          />
          <Image src={image || '/p6.png'} alt={'Social background'} />
        </Stack>
      </Container>
    </div>
  );
}
