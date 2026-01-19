import { Box } from '@mantine/core';
import HeaderImageFull from '@/shared-sections/header-image-full';
import HeroImageCenter from '@/shared-sections/hero-image-center';
import TitleLeftTextRight from '@/shared-sections/title-left--text-right';
import ImageBoxRightFullh from '@/shared-sections/image-box-right-fullh';
import ImageBoxLeftFullh from '@/shared-sections/image-box-left-fullh';
import TitleRight from '@/shared-sections/title-right';
import TitleLeft from '@/shared-sections/title-left';
import ImageLeftTextRight from '@/shared-sections/image-left-text-right';
import BannerWithLink from '@/shared-sections/banner-with-link';
import ThreeColumnGrid from '@/shared-sections/three-column-grid';
import NumberedStepsGrid from '@/shared-sections/numbered-steps-grid';
import GoogleMap from '@/shared-sections/google-map';
import CtaImageLeft from '@/shared-sections/cta-image-left';
import ImageTextOverlayLeft from '@/shared-sections/image-text-overlay-left';
import TitleCenterImage from '@/shared-sections/title-center-image';
import TextBoxRight from '@/shared-sections/text-box-right';
import ProjectCategory from '@/shared-sections/project-category';
import ProjectShowcase from '@/shared-sections/project-showcase';
import TextCenterTitleText from '@/shared-sections/text-center-title-text';
import InstagramCta from '@/shared-sections/instagram-cta';
import TitleTextCentered from '@/shared-sections/title-text-centered';
import TitleTextStack from '@/shared-sections/title-text-stack';
import EventsGrid from '@/shared-sections/events-grid';
import ScrollCards from '@/shared-sections/scroll-cards';
import PhotoGallery from '@/shared-sections/photo-gallery';
import SocialCtaCombined from '@/shared-sections/social-cta-combined';
import CtaColoredBg from '@/shared-sections/cta-colored-bg';
import ThreeColumnsText from '@/shared-sections/three-columns-text';
import { PageSection } from '@/types/section';

// Mappa spacing values a valori Mantine
const spacingMap: Record<string, string> = {
  xs: 'var(--mantine-spacing-xs)',
  sm: 'var(--mantine-spacing-sm)',
  md: 'var(--mantine-spacing-md)',
  lg: 'var(--mantine-spacing-lg)',
  xl: 'var(--mantine-spacing-xl)',
  '2xl': 'calc(var(--mantine-spacing-xl) * 1.5)',
  '3xl': 'calc(var(--mantine-spacing-xl) * 2)',
  '4xl': 'calc(var(--mantine-spacing-xl) * 3)',
};

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  HeaderImageFull,
  HeroImageCenter,
  TitleLeftTextRight,
  ImageBoxRightFullh,
  ImageBoxLeftFullh,
  TitleRight,
  TitleLeft,
  ImageLeftTextRight,
  BannerWithLink,
  ThreeColumnGrid,
  NumberedStepsGrid,
  GoogleMap,
  CtaImageLeft,
  ImageTextOverlayLeft,
  TitleCenterImage,
  TextBoxRight,
  ProjectCategory,
  ProjectShowcase,
  TextCenterTitleText,
  InstagramCta,
  TitleTextCentered,
  TitleTextStack,
  EventsGrid,
  ScrollCards,
  PhotoGallery,
  SocialCtaCombined,
  CtaColoredBg,
  ThreeColumnsText,
};

interface SectionRendererProps {
  section: PageSection;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = SECTION_COMPONENTS[section.section_type];

  if (!Component) {
    console.warn(`Unknown section type: ${section.section_type}`);
    return null;
  }

  // v1.1: Calcola stili per spacing
  const wrapperStyle: React.CSSProperties = {};
  const extSection = section as any;

  if (extSection.padding_top && spacingMap[extSection.padding_top]) {
    wrapperStyle.paddingTop = spacingMap[extSection.padding_top];
  }
  if (extSection.padding_bottom && spacingMap[extSection.padding_bottom]) {
    wrapperStyle.paddingBottom = spacingMap[extSection.padding_bottom];
  }
  if (extSection.margin_top && spacingMap[extSection.margin_top]) {
    wrapperStyle.marginTop = spacingMap[extSection.margin_top];
  }
  if (extSection.margin_bottom && spacingMap[extSection.margin_bottom]) {
    wrapperStyle.marginBottom = spacingMap[extSection.margin_bottom];
  }

  // v1.1: Props responsive visibility
  const visibilityProps: any = {};
  if (extSection.visible_from) {
    visibilityProps.visibleFrom = extSection.visible_from;
  }
  if (extSection.hidden_from) {
    visibilityProps.hiddenFrom = extSection.hidden_from;
  }

  const hasWrapper = Object.keys(wrapperStyle).length > 0 || Object.keys(visibilityProps).length > 0;

  const content = (
    <Component
      title={section.title}
      text={section.text}
      image={section.image}
      imageMobile={section.image_mobile}
      href={section.href}
      buttonText={extSection.button_text}
      imageFixed={!!extSection.image_fixed}
    />
  );

  if (hasWrapper) {
    return (
      <Box style={wrapperStyle} {...visibilityProps}>
        {content}
      </Box>
    );
  }

  return content;
}
