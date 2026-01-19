// Configurazione campi per ogni tipo di sezione
// Definisce quali campi sono disponibili per ciascun layout

export interface SectionFieldConfig {
  label: string;
  fields: {
    title: boolean;
    titleHtml: boolean;  // Se il titolo supporta HTML (dangerouslySetInnerHTML)
    text: boolean;
    textHtml: boolean;   // Se il testo supporta HTML
    image: boolean;
    imageMobile: boolean; // Immagine per mobile
    href: boolean;       // Link/URL cliccabile
    buttonText: boolean; // Testo personalizzato bottone
  };
  descriptions?: {
    title?: string;
    text?: string;
    image?: string;
    imageMobile?: string;
    href?: string;
    buttonText?: string;
  };
}

export const SECTION_FIELD_CONFIG: Record<string, SectionFieldConfig> = {
  HeaderImageFull: {
    label: 'Header con Immagine Full',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo con sfondo immagine a tutto schermo. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine di sfondo a tutto schermo',
    },
  },

  HeroImageCenter: {
    label: 'Hero Immagine Centrata',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: true,
      imageMobile: false,
      href: true,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo centrato sull\'immagine. Supporta HTML: <b>, <i>, <br/>',
      text: 'Sottotitolo centrato. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine di sfondo',
      href: 'Link cliccabile (opzionale). Es: /evento/nome-evento',
    },
  },

  TitleLeftTextRight: {
    label: 'Titolo Sinistra - Testo Destra',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo a sinistra. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo a destra. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  ImageBoxRightFullh: {
    label: 'Immagine Box Destra',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo nel box a destra. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine di sfondo a tutto schermo',
    },
  },

  ImageBoxLeftFullh: {
    label: 'Immagine Box Sinistra',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo nel box a sinistra. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine di sfondo a tutto schermo',
    },
  },

  TitleRight: {
    label: 'Titolo a Destra',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo posizionato a destra. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  TitleLeft: {
    label: 'Titolo a Sinistra',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo posizionato a sinistra. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  ImageLeftTextRight: {
    label: 'Immagine Sinistra - Testo Destra',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo principale. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo descrittivo. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine di sfondo sulla sinistra (50% larghezza)',
    },
  },

  BannerWithLink: {
    label: 'Banner con Titolo',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo bianco sul banner. Supporta HTML: <b>, <i>, <br/>',
      text: 'Sottotitolo (es: CHI SIAMO). Supporta HTML.',
      image: 'Immagine di sfondo del banner',
    },
  },

  ThreeColumnGrid: {
    label: 'Griglia 3 Colonne (Homepage)',
    fields: {
      title: false,
      titleHtml: false,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Configurazione desktop (JSON). Lasciare vuoto per default homepage.',
      text: 'Configurazione mobile (JSON). Lasciare vuoto per default homepage.',
    },
  },

  NumberedStepsGrid: {
    label: 'Griglia Passi Numerati',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Configurazione passi in formato JSON. Es: [{"number":"01","title":"Titolo","text":"Descrizione"},...]',
    },
  },

  GoogleMap: {
    label: 'Mappa Google',
    fields: {
      title: true,
      titleHtml: false,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Indirizzo per la mappa o URL embed di Google Maps',
    },
  },

  CtaImageLeft: {
    label: 'CTA con Immagine Sinistra',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: true,
      imageMobile: false,
      href: true,
      buttonText: true,
    },
    descriptions: {
      title: 'Titolo della CTA. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo descrittivo. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine sulla sinistra',
      href: 'Link del bottone (default: /contatti)',
      buttonText: 'Testo del bottone (default: PRENOTA ORA)',
    },
  },

  ImageTextOverlayLeft: {
    label: 'Immagine con Testo Overlay Sinistra',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: true,
      imageMobile: true,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo nel box overlay. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo nel box overlay. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine di sfondo desktop',
      imageMobile: 'Immagine di sfondo mobile (opzionale)',
    },
  },

  TitleCenterImage: {
    label: 'Titolo Centrato con Immagine',
    fields: {
      title: true,
      titleHtml: true,
      text: false,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo centrato. Supporta HTML: <b>, <i>, <br/>',
      image: 'Immagine sotto il titolo',
    },
  },

  TextBoxRight: {
    label: 'Box Testo a Destra',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo nel box. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo nel box. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  ProjectCategory: {
    label: 'Categoria Progetto',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: true,
      imageMobile: true,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Nome della categoria (es: Open space). Supporta HTML',
      text: 'Descrizione della categoria. Supporta HTML',
      image: 'Immagine di sfondo desktop',
      imageMobile: 'Immagine mobile alternativa',
    },
  },

  ProjectShowcase: {
    label: 'Showcase Progetto',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: true,
      buttonText: false,
    },
    descriptions: {
      title: 'Nome del progetto. Supporta HTML: <b>, <i>, <br/>',
      text: 'Posizione immagine nel layout desktop: "left" o "right"',
      image: 'Immagine del progetto',
      href: 'Link alla pagina del progetto',
    },
  },

  TextCenterTitleText: {
    label: 'Titolo e Testo Centrati',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo a sinistra. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo a destra. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  InstagramCta: {
    label: 'CTA Instagram (Mobile)',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo della CTA. Supporta HTML: <b>, <i>, <br/>',
      text: 'Username Instagram (es: @sassiarredamenti)',
      image: 'Icona Instagram',
    },
  },

  TitleTextCentered: {
    label: 'Titolo e Testo con Sfondo',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo principale. Supporta HTML: <b>, <i>, <br/>',
      text: 'Sottotitolo. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  TitleTextStack: {
    label: 'Titolo e Testo Stack',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: true,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo principale. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo sotto il titolo. Supporta HTML: <b>, <i>, <br/>',
    },
  },

  EventsGrid: {
    label: 'Griglia Eventi',
    fields: {
      title: true,
      titleHtml: false,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Categoria eventi da mostrare (es: vetrina, evento)',
    },
  },

  ScrollCards: {
    label: 'Cards Scroll Interattive',
    fields: {
      title: true,
      titleHtml: false,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Configurazione cards in formato JSON. Lasciare vuoto per default.',
    },
  },

  PhotoGallery: {
    label: 'Galleria Foto',
    fields: {
      title: true,
      titleHtml: false,
      text: true,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Array JSON di foto: [{"src":"/path/img.png","width":800,"height":600},...]',
      text: 'Opzioni galleria: "bullets" per mostrare i pallini invece delle frecce',
    },
  },

  SocialCtaCombined: {
    label: 'CTA Social Combinata',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: false,
      image: true,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'Titolo desktop. Supporta HTML: <b>, <i>, <br/>',
      text: 'Username social (es: @miettacorli)',
      image: 'Immagine di sfondo desktop',
    },
  },

  CtaColoredBg: {
    label: 'CTA con Sfondo Colorato',
    fields: {
      title: true,
      titleHtml: true,
      text: true,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: true,
      buttonText: true,
    },
    descriptions: {
      title: 'Titolo della CTA. Supporta HTML: <b>, <i>, <br/>',
      text: 'Testo del bottone (alternativo a buttonText)',
      href: 'Link destinazione del bottone',
      buttonText: 'Testo del bottone (default: CLICCA QUI)',
    },
  },

  ThreeColumnsText: {
    label: 'Tre Colonne di Testo',
    fields: {
      title: true,
      titleHtml: false,
      text: false,
      textHtml: false,
      image: false,
      imageMobile: false,
      href: false,
      buttonText: false,
    },
    descriptions: {
      title: 'JSON con array di 3 colonne: [{title, text, links: [{label, href}]}]',
    },
  },
};

// Helper per ottenere i campi attivi per un tipo di sezione
export function getActiveFields(sectionType: string) {
  const config = SECTION_FIELD_CONFIG[sectionType];
  if (!config) return null;
  return config;
}

// Lista delle sezioni per il Select
export const SECTION_TYPES = Object.entries(SECTION_FIELD_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
}));
