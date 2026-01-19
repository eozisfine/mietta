import { Box, Button, Flex, Image, Title } from "@mantine/core";
import Link from "next/link";

interface CtaImageLeftProps {
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  buttonText?: string;
}

export default function CtaImageLeft({ title, text, image, href, buttonText }: CtaImageLeftProps) {
  const linkHref = href || '/contatti';

  return (
    <Flex bg={'#E9E7E4'} direction={{ base: 'column', md: 'row' }}>
      <Box flex={1}>
        <Image src={image} alt={'CTA background'} />
      </Box>
      <Box flex={1} style={{ display: 'flex' }}>
        <Flex justify={'center'} direction={'column'} p={'6%'} flex={1}>
          <Title
            order={2}
            dangerouslySetInnerHTML={{ __html: title || '' }}
          />
          {text && (
            <Title
              mt={'md'}
              mb={'xl'}
              order={4}
              dangerouslySetInnerHTML={{ __html: text || '' }}
            />
          )}
          <div>
            <Button
              radius={'xl'}
              component={Link}
              href={linkHref}
              mt={'md'}
              size={'lg'}
              variant={'filled'}
              color={'#7E8470'}
            >
              {buttonText || 'PRENOTA ORA'}
            </Button>
          </div>
        </Flex>
      </Box>
    </Flex>
  );
}
