import { Flex, Paper, SimpleGrid, Title } from '@mantine/core';
import classes from '../app/sectionOne.module.css';

export default function ImageBoxLeftFullh(props: any) {

  return (
      <div className={classes.hero}
           style={{
             backgroundImage: `url(${props.image})`,
             backgroundAttachment: props.imageFixed ? 'fixed' : undefined,
           }}
      >
        <Flex mih={'100vh'} align={'flex-end'}>
          <Paper bg={'white'} p={'xl'} flex={1} radius={0}>
            <Title ta={'right'} dangerouslySetInnerHTML={{ __html: props.title }}/>
          </Paper>
          <div style={{flex: 1}}/>
        </Flex>
      </div>
  )
}