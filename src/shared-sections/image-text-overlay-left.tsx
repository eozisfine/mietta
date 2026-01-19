import { Container, Flex, Image, Paper, Title } from '@mantine/core';

interface ImageTextOverlayLeftProps {
  title?: string;
  text?: string;
  image?: string;
  imageMobile?: string;
  imageFixed?: boolean;
}

export default function ImageTextOverlayLeft({
  title,
  text,
  image,
  imageMobile,
  imageFixed
}: ImageTextOverlayLeftProps) {
  return (
    <div
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundColor: '#F2F2F2',
        marginTop: 120,
        backgroundAttachment: imageFixed ? 'fixed' : undefined,
      }}
    >
      {imageMobile && (
        <Image
          hiddenFrom={'md'}
          src={imageMobile}
          alt="mobile background"
        />
      )}
      <Container size={'xl'} p={{ base: 0 }}>
        <Flex mih={'100vh'} align={'flex-start'}>
          <Paper bg={'#F2F2F2'} p={'xl'}>
            <Title
              ta={'left'}
              order={2}
              mb={{ base: 40, md: 0 }}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
            {text && (
              <Title
                order={4}
                dangerouslySetInnerHTML={{ __html: text || '' }}
              />
            )}
          </Paper>
          <div style={{ flex: 1 }} />
        </Flex>
      </Container>
    </div>
  );
}
