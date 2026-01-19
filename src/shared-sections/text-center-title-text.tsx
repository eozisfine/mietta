import { Container, Flex, Paper, Title } from '@mantine/core';

interface TextCenterTitleTextProps {
  title?: string;
  text?: string;
}

export default function TextCenterTitleText({ title, text }: TextCenterTitleTextProps) {
  return (
    <Paper pt={120} pb={120}>
      <Container size={'xl'}>
        <Flex justify="center" align="center" gap={60} direction={{ base: 'column', md: 'row' }}>
          <Title
            ta={'right'}
            order={2}
            flex={1}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          <Title
            order={4}
            flex={1}
            dangerouslySetInnerHTML={{ __html: text || '' }}
          />
        </Flex>
      </Container>
    </Paper>
  );
}
