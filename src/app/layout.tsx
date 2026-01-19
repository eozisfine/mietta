import type { Metadata } from "next";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from "@mantine/core";
import { Buda, Fira_Mono } from "next/font/google";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Notifications } from "@mantine/notifications";
import SiteScripts from "@/components/SiteScripts";

export const metadata: Metadata = {
  title: "Mietta Corli - Regista, Scenografa, Video-Artista",
  description: "Mietta Corli - Regista, scenografa e video-artista. Teatro lirico e musicale contemporaneo.",
};

// Font per titoli - Buda (leggero, elegante)
const budaFont = Buda({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-title",
});

// Font per body - Fira Mono
const firaMonoFont = Fira_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const theme = createTheme({
  fontFamily: "var(--font-body), 'Fira Mono', monospace",
  headings: {
    fontFamily: "var(--font-title), 'Buda', serif",
    fontWeight: "300",
    sizes: {
      h1: { fontSize: '48px', lineHeight: '1.1' },
      h2: { fontSize: '40px', lineHeight: '1.2' },
      h3: { fontSize: '32px', lineHeight: '1.25' },
      h4: { fontSize: '24px', lineHeight: '1.3' },
      h5: { fontSize: '20px', lineHeight: '1.35' },
      h6: { fontSize: '16px', lineHeight: '1.4' }
    }
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px'
  },
  colors: {
    // Colori custom per Mietta Corli
    mietta: [
      '#f5f5f5',  // 0 - lightest
      '#e0e0e0',  // 1
      '#bdbdbd',  // 2
      '#9e9e9e',  // 3
      '#757575',  // 4
      '#6B7A8C',  // 5 - CTA background (blu/grigio)
      '#4A4A4A',  // 6 - text color
      '#424242',  // 7
      '#303030',  // 8
      '#212121',  // 9 - darkest
    ],
  },
  primaryColor: 'mietta',
});


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="it"
            className={`${budaFont.variable} ${firaMonoFont.variable}`}
            style={{overflowX: 'hidden'}}>
      <body style={{overflow: 'visible!important', width: '100%', margin: 0, padding: 0, color: '#4A4A4A'}}>
      <MantineProvider theme={theme} forceColorScheme={'light'}>
        <SiteScripts />
        <Notifications />
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </MantineProvider>
      </body>
      </html>
  );
}
