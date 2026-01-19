import {
  Flex,
  Image,
  Paper,
  Stack,
  Title
} from "@mantine/core";

interface ImageLeftTextRightProps {
  title?: string;
  text?: string;
  image?: string;
  imageMobile?: string;
  bgColor?: string;
}

export default function ImageLeftTextRight({
  title,
  text,
  image,
  imageMobile,
  bgColor = "#F2F2F2"
}: ImageLeftTextRightProps) {
  return (
    <Paper bg={bgColor}>
      <Flex
        justify="flex-end"
        align="flex-end"
        direction={{ base: 'column', md: 'row' }}
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '50%',
          backgroundPosition: 'left center',
          minHeight: '100vh'
        }}
      >
        {imageMobile && (
          <Image
            hiddenFrom={'md'}
            src={imageMobile}
          />
        )}
        <Paper
          bg={bgColor}
          pt={{ base: 60, md: 120 }}
          p={'5%'}
          pl={{ base: '5%', md: 100 }}
          radius={0}
          w={{ base: '100%', md: '55%' }}
        >
          <Stack>
            <Title
              order={2}
              mt={{ base: 40, md: 0 }}
              ta={{ base: 'right', md: 'left' }}
              dangerouslySetInnerHTML={{ __html: title || '' }}
            />
            {text && (
              <Title
                ta={{ base: 'center', md: 'left' }}
                mt={{ base: 40, md: 0 }}
                order={4}
                dangerouslySetInnerHTML={{ __html: text || '' }}
              />
            )}
          </Stack>
        </Paper>
      </Flex>
    </Paper>
  );
}
