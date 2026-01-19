import { Container, Flex, Title, Box, Button } from "@mantine/core";

interface CtaColoredBgProps {
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  buttonText?: string;
}

export default function CtaColoredBg({
  title,
  text,
  href,
  buttonText,
}: CtaColoredBgProps) {
  return (
    <Box
      style={{
        background: '#6B7A8C',
        padding: '80px 0',
      }}
    >
      <Container size={'xl'}>
        <Flex justify={'space-between'} align={'center'} wrap={'wrap'} gap={'xl'}>
          <Title
            order={2}
            c={'white'}
            style={{ fontWeight: 300 }}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          {href && (
            <Button
              component="a"
              href={href}
              variant="outline"
              color="white"
              size="lg"
              styles={{
                root: {
                  borderColor: 'white',
                  color: 'white',
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  padding: '15px 30px',
                  height: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }
              }}
            >
              {buttonText || text || 'CLICCA QUI'}
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
}
