import { Box, Container, Flex, Image, Paper, Text, Title } from '@mantine/core';
import classes from '../app/sectionOne.module.css';

export default function ImageBoxRightFullh(props: any) {

  return (
      <>
        <div className={classes.hero}
             style={{
               backgroundImage: `url(${props.image})`,
               backgroundAttachment: props.imageFixed ? 'fixed' : undefined,
             }}
        >
          <Container fluid visibleFrom={'md'}>
            <Flex style={{ minHeight: '100vh' }} align={'flex-end'}>
              <div style={{ flex: 1 }}/>
              <Paper bg={'F2F2F2'} p={'xl'} flex={1} radius={0}>
                <Title m={'6%'} order={2}
                       dangerouslySetInnerHTML={{ __html: props.title }}/>
              </Paper>
            </Flex>
          </Container>
        </div>
        <Image
            src={props.image}
            hiddenFrom={'md'}/>
        <Container fluid hiddenFrom={'md'}>
          <Box p={'md'}>
            <Title m={'6%'} order={2}
                   dangerouslySetInnerHTML={{ __html: props.title }}/>
          </Box>
        </Container>
      </>
  )
}