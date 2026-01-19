import { Container, Flex, Paper, Title } from "@mantine/core";

export default function TitleLeftTextRight(props: any) {
  return (
      <Paper bg="#F2F2F2" pt={{base: 40, md: 120}} pb={{base: 40, md: 120}}>
        <Container size={'xl'}>
          <Flex justify="center" align="center" gap={60}
                p={{base: 'xl', md: 0}}
                direction={{ base: 'column', md: 'row' }}>
            <Title ta={{ base: 'left', md: 'right' }} order={2} flex={1}
                   dangerouslySetInnerHTML={{ __html: props.title }}/>
            <Title order={4} flex={1}
                   ta={{base: 'center', md: 'left'}}
                   dangerouslySetInnerHTML={{ __html: props.text }}/>
          </Flex>
        </Container>
      </Paper>
  )
}