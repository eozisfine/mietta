import { z } from 'zod';

// Enum per breakpoint responsive
export const BreakpointEnum = z.enum(['', 'xs', 'sm', 'md', 'lg', 'xl']).transform(val => val === '' ? undefined : val);

// Enum per spacing values
export const SpacingEnum = z.enum(['', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']).transform(val => val === '' ? undefined : val);

// Schema per le pagine dinamiche
export const PageSchema = z.object({
  id: z.number(),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  cover_image: z.string().optional(),
  published: z.boolean().default(true),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  seo_og_image: z.string().optional(),
  seo_no_index: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Page = z.infer<typeof PageSchema>;

export const CreatePageSchema = PageSchema.omit({ id: true });
export const UpdatePageSchema = PageSchema.partial().required({ id: true });

// Schema per le sezioni delle pagine
export const PageSectionSchema = z.object({
  id: z.number().optional(),
  page_id: z.number(),
  section_type: z.enum([
    'HeaderImageFull',
    'HeroImageCenter',
    'TitleLeftTextRight',
    'ImageBoxRightFullh',
    'ImageBoxLeftFullh',
    'TitleRight',
    'TitleLeft',
    'ImageLeftTextRight',
    'BannerWithLink',
    'ThreeColumnGrid',
    'NumberedStepsGrid',
    'GoogleMap',
    'CtaImageLeft',
    'ImageTextOverlayLeft',
    'TitleCenterImage',
    'TextBoxRight',
    'ProjectCategory',
    'ProjectShowcase',
    'TextCenterTitleText',
    'InstagramCta',
    'TitleTextCentered',
    'TitleTextStack',
    'EventsGrid',
    'ScrollCards',
    'PhotoGallery',
    'SocialCtaCombined'
  ]),
  title: z.string().optional(),
  text: z.string().optional(),
  image: z.string().optional(),
  image_mobile: z.string().optional(),
  href: z.string().optional(),
  button_text: z.string().optional(),
  order_index: z.number(),
  animation: z.string().default('fadeUp'),
  animation_delay: z.number().default(0.1),
  // v1.1: Parallax
  image_fixed: z.union([z.boolean(), z.number()]).transform(val => val === 1 || val === true).optional(),
  // v1.1: Spacing
  padding_top: z.string().optional(),
  padding_bottom: z.string().optional(),
  margin_top: z.string().optional(),
  margin_bottom: z.string().optional(),
  // v1.1: Responsive visibility
  visible_from: z.string().optional(),
  hidden_from: z.string().optional(),
});

export type PageSection = z.infer<typeof PageSectionSchema>;

export const CreatePageSectionSchema = PageSectionSchema.omit({ id: true });
export const UpdatePageSectionSchema = PageSectionSchema.partial().required({ id: true });
