import {
  Box,
  Container,
  Flex,
  Image,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import classes from '@/app/sectionOne.module.css';

interface ProjectCategoryProps {
  title?: string;
  text?: string;
  image?: string;
  imageMobile?: string;
}

export default function ProjectCategory({ title, text, image, imageMobile }: ProjectCategoryProps) {
  return (
    <>
      <div
        className={classes.hero}
        style={{
          backgroundImage: `url(${image})`,
          marginTop: 20,
        }}
      >
        <Container fluid visibleFrom={'md'}>
          <Flex style={{ minHeight: '60vh' }} align={'flex-end'}>
            <div style={{ flex: 1 }} />
            <Paper bg={'F2F2F2'} p={'xl'} flex={1} radius={0}>
              <Flex direction={'column'} justify={'space-between'}>
                <Text>CIO' CHE AMIAMO CREARE</Text>
                <Stack mt={'xl'}>
                  <Title
                    order={2}
                    dangerouslySetInnerHTML={{ __html: title || '' }}
                  />
                  <Text dangerouslySetInnerHTML={{ __html: text || '' }} />
                </Stack>
              </Flex>
            </Paper>
          </Flex>
        </Container>
      </div>

      {imageMobile && (
        <Image src={imageMobile} hiddenFrom={'md'} alt={title || 'Categoria progetto'} />
      )}
      <Container fluid hiddenFrom={'md'}>
        <Box p={'md'}>
          <Title
            order={2}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          <Text
            mt={'md'}
            dangerouslySetInnerHTML={{ __html: text || '' }}
          />
        </Box>
      </Container>
    </>
  );
}
