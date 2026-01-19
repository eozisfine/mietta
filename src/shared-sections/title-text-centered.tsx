import { Container, Flex, Paper, Stack, Text, Title } from '@mantine/core';

interface TitleTextCenteredProps {
  title?: string;
  text?: string;
}

export default function TitleTextCentered({ title, text }: TitleTextCenteredProps) {
  return (
    <Paper bg="#E9E7E4" pt={90} pb={90}>
      <Container size={'xl'}>
        <Flex align="center" gap={60} direction={{ base: 'column', md: 'row' }}>
          <Stack>
            <Title
              ta={'right'}
              order={2}
              flex={1}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
            {text && <Text dangerouslySetInnerHTML={{ __html: text || '' }} />}
          </Stack>
        </Flex>
      </Container>
    </Paper>
  );
}
