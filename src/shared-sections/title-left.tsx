import { Container, Paper, SimpleGrid, Title } from "@mantine/core";

interface TitleLeftProps {
  title?: string;
  bgColor?: string;
}

export default function TitleLeft({ title, bgColor = "#F2F2F2" }: TitleLeftProps) {
  return (
    <Paper bg={bgColor} pt={120} pb={200}>
      <Container size={'lg'}>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <div>
            <Title
              order={2}
              ta={{ base: 'right', md: 'left' }}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
          </div>
          <div />
        </SimpleGrid>
      </Container>
    </Paper>
  );
}
