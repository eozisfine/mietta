import { Container, Overlay, Title, Text, Stack } from "@mantine/core";
import Link from "next/link";

interface HeroImageCenterProps {
  title?: string;
  text?: string;
  image?: string;
  href?: string;
  imageFixed?: boolean;
}

export default function HeroImageCenter(props: HeroImageCenterProps) {
  const content = (
    <>
      <style>{`
        .hero-center {
          position: relative;
          background-size: cover;
          background-position: center;
          overflow: hidden;
        }
        .hero-center-container {
          position: relative;
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .hero-center-title {
          color: white;
          font-size: 60px;
          font-weight: 500;
          line-height: 1.1;
          text-align: center;
        }
        .hero-center-text {
          color: white;
          font-size: 20px;
          text-align: center;
          max-width: 800px;
        }
        .hero-center-link {
          text-decoration: none;
          display: block;
          cursor: pointer;
        }
        .hero-center-link:hover .hero-center {
          opacity: 0.9;
        }
        @media (max-width: 48em) {
          .hero-center-title {
            font-size: 40px;
            line-height: 1.2;
          }
          .hero-center-text {
            font-size: 16px;
          }
        }
        @media (max-width: 36em) {
          .hero-center-title {
            font-size: 28px;
            line-height: 1.3;
          }
          .hero-center-text {
            font-size: 14px;
          }
        }
      `}</style>
      <div
        className="hero-center"
        style={{
          backgroundImage: `url(${props.image})`,
          backgroundAttachment: props.imageFixed ? 'fixed' : undefined,
        }}
      >
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.6) 100%)"
          opacity={1}
          zIndex={1}
        />
        <Container className="hero-center-container" fluid>
          <Stack align="center" gap="lg">
            {props.title && (
              <Title
                className="hero-center-title"
                dangerouslySetInnerHTML={{ __html: props.title }}
              />
            )}
            {props.text && (
              <Text
                className="hero-center-text"
                dangerouslySetInnerHTML={{ __html: props.text }}
              />
            )}
          </Stack>
        </Container>
      </div>
    </>
  );

  if (props.href) {
    return (
      <Link href={props.href} className="hero-center-link">
        {content}
      </Link>
    );
  }

  return content;
}
