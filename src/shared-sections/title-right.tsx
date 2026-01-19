import { Container, Paper, SimpleGrid, Title } from "@mantine/core";

interface TitleRightProps {
  title?: string;
  bgColor?: string;
}

export default function TitleRight({ title, bgColor = "#E9E7E4" }: TitleRightProps) {
  return (
    <Paper bg={bgColor} pt={{ base: 40, md: 120 }} pb={{ base: 40, md: 120 }}>
      <Container fluid>
        <SimpleGrid cols={{ base: 1, md: 2 }} p={{ base: 'xl', md: 0 }}>
          <div />
          <div>
            <Title
              order={2}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
          </div>
        </SimpleGrid>
      </Container>
    </Paper>
  );
}
