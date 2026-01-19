import { Container, Divider, Flex, Paper, Title } from "@mantine/core";

interface BannerWithLinkProps {
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  imageFixed?: boolean;
}

export default function BannerWithLink({
  title,
  text,
  image,
  imageFixed,
}: BannerWithLinkProps) {
  return (
    <Paper
      style={{
        background: `url(${image}) no-repeat top center`,
        backgroundSize: "cover",
        backgroundAttachment: imageFixed ? 'fixed' : undefined,
      }}
    >
      <Container size={'80%'}>
        <Flex justify={'flex-end'} align={'flex-end'} h={502} p={'xl'}>
          <Flex direction={'column'}>
            <Title
              order={2}
              c={'white'}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
            <Divider size={2} mt={'sm'} mb={'sm'} />
            {text && (
              <Title
                mb='xl'
                order={4}
                c={'white'}
                dangerouslySetInnerHTML={{ __html: text || '' }}
              />
            )}
          </Flex>
        </Flex>
      </Container>
    </Paper>
  );
}
