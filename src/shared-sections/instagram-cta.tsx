import {
  Container,
  Flex,
  Image,
  Text,
  Title
} from '@mantine/core';

interface InstagramCtaProps {
  title?: string;
  text?: string; // username
  image?: string;
}

export default function InstagramCta({ title, text, image }: InstagramCtaProps) {
  return (
    <Container hiddenFrom={'md'} p={40} bg={'#F2F2F2'}>
      <Flex direction="column" gap={'md'}>
        <Title
          ta={'center'}
          order={2}
          dangerouslySetInnerHTML={{ __html: title || 'Scopri i nostri<br/>ultimi progetti!' }}
        />
        <Image src={image || '/instagram.png'} w={100} m={'auto'} alt="Instagram" />
        <Text ta={'center'}>{text || '@sassiarredamenti'}</Text>
      </Flex>
    </Container>
  );
}
