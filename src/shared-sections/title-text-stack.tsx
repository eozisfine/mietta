import { Container, Stack, Text, Title } from '@mantine/core';

interface TitleTextStackProps {
  title?: string;
  text?: string;
}

export default function TitleTextStack({ title, text }: TitleTextStackProps) {
  return (
    <div>
      <Container fluid>
        <Stack mt={90} mb={90}>
          <Title
            ml={'6%'}
            order={2}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          {text && (
            <Text
              ml={'6%'}
              dangerouslySetInnerHTML={{ __html: text || '' }}
            />
          )}
        </Stack>
      </Container>
    </div>
  );
}
