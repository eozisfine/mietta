import { Container, Flex, Paper, Title } from '@mantine/core';

interface TextBoxRightProps {
  title?: string;
  text?: string;
}

export default function TextBoxRight({ title, text }: TextBoxRightProps) {
  return (
    <Container fluid>
      <Flex mt={'xl'} mb={'xl'} style={{ overflow: 'hidden' }}>
        <div style={{ flex: 1 }} />
        <Paper bg={'white'} p={'xl'} flex={1} mt={'xl'} mb={'xl'}>
          <Title
            ta={'left'}
            order={2}
            mt={'xl'}
            mb={'lg'}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          {text && (
            <Title
              ta={{ base: 'center', md: 'left' }}
              mt={40}
              order={4}
              mb={'xl'}
              dangerouslySetInnerHTML={{ __html: text || '' }}
            />
          )}
        </Paper>
      </Flex>
    </Container>
  );
}
