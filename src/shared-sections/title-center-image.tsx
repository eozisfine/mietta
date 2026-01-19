import { Container, Image, Stack, Title } from '@mantine/core';

interface TitleCenterImageProps {
  title?: string;
  image?: string;
}

export default function TitleCenterImage({ title, image }: TitleCenterImageProps) {
  return (
    <div>
      <Container fluid>
        <Stack mt={90} mb={90}>
          <Title
            ta="center"
            order={2}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          {image && <Image src={image} alt={'section image'} />}
        </Stack>
      </Container>
    </div>
  );
}
