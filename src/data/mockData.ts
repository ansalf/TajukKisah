// Design Tokens & Configuration for TajukKisah

export const PALETTE = {
  ivory: '#F6F0E6',
  ivoryLight: '#FAF6EE',
  burgundy: '#651F32',
  burgundyDark: '#4A1423',
  burgundyLight: '#7E283F',
  espresso: '#2A151B',
  espressoRich: '#1E0E13',
  gold: '#C7A66A',
  goldLight: '#DFC48F',
  goldDark: '#A9874D',
  warmWhite: '#FFFCF7',
  stone: '#E6DFD5',
  charcoalMuted: '#5A474D',
  borderSubtle: 'rgba(101, 31, 50, 0.12)',
  borderGold: 'rgba(199, 166, 106, 0.3)',
} as const;

export interface WeddingData {
  couple: {
    groom: {
      fullName: string;
      shortName: string;
      father: string;
      mother: string;
      photoUrl: string;
    };
    bride: {
      fullName: string;
      shortName: string;
      father: string;
      mother: string;
      photoUrl: string;
    };
    monogram: string;
    quote: string;
    quoteSource: string;
    storyNarrative: string;
  };
  event: {
    dateFormatted: string;
    dayOfWeek: string;
    timeFormatted: string;
    calendarDate: string; // ISO format
    holyMatrimony: {
      title: string;
      time: string;
      venue: string;
      address: string;
    };
    reception: {
      title: string;
      time: string;
      venue: string;
      address: string;
    };
  };
  heroPhoto: string;
  galleryPhotos: string[];
}

export interface ColorVariant {
  id: string;
  name: string;
  background: string;
  surface: string;
  text: string;
  accent: string;
  border: string;
}

export interface TemplateConcept {
  id: 'editorial-romance' | 'modern-botanical' | 'dark-luxury' | 'velvet-noir-editorial';
  title: string;
  subtitle: string;
  description: string;
  paletteTheme: {
    background: string;
    surface: string;
    text: string;
    accent: string;
    border: string;
    badge: string;
  };
  colorVariants?: ColorVariant[];
  tags: string[];
  previewImage: string;
  aestheticNotes: string;
}

export const TEMPLATES_DATA: TemplateConcept[] = [
  {
    id: 'editorial-romance',
    title: 'Editorial Romance',
    subtitle: 'Classic Vignette & Timeless Typography',
    description: 'Imbued with the warmth of ivory, rich burgundy typography, and classic editorial serif titles. Designed for grand ballroom affairs and timeless romantic celebrations.',
    paletteTheme: {
      background: '#F6F0E6',
      surface: '#FFFCF7',
      text: '#2A151B',
      accent: '#651F32',
      border: 'rgba(101, 31, 50, 0.15)',
      badge: 'Burgundy & Ivory',
    },
    colorVariants: [
      { id: 'ivory-burgundy', name: 'Burgundy Classic', background: '#F6F0E6', surface: '#FFFCF7', text: '#2A151B', accent: '#651F32', border: 'rgba(101, 31, 50, 0.15)' },
      { id: 'ivory-rose', name: 'Dusty Rose', background: '#F8F1EE', surface: '#FFFDFC', text: '#341D24', accent: '#8E4057', border: 'rgba(142, 64, 87, 0.2)' },
      { id: 'ivory-gold', name: 'Champagne Gold', background: '#F9F5EC', surface: '#FFFEFA', text: '#2E2619', accent: '#A07D3E', border: 'rgba(160, 125, 62, 0.22)' },
    ],
    tags: ['Ivory & Burgundy', 'Editorial Serif', 'Timeless Heritage', 'Vignette Frames'],
    // High quality royalty-free unsplash wedding photography
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    aestheticNotes: 'Generous whitespace, arched borders, classic monograms, and delicate floral botanical engravings.'
  },
  {
    id: 'velvet-noir-editorial',
    title: 'Velvet Noir & Burgundy',
    subtitle: 'Dramatic Crimson Velvet & Calligraphic Monogram',
    description: 'Inspired by fine royal couture stationery: deep crimson velvet backdrop, scalloped parchment invitations with hand-drawn calendar hearts, dramatic rose bouquets, vertical timelines, and chic dress code swatches.',
    paletteTheme: {
      background: '#2B080E',
      surface: '#3A0C14',
      text: '#F5EBE1',
      accent: '#D4AF37',
      border: 'rgba(212, 175, 55, 0.35)',
      badge: 'Velvet Crimson & Gold Wax',
    },
    colorVariants: [
      { id: 'crimson-gold', name: 'Royal Crimson', background: '#2B080E', surface: '#3A0C14', text: '#F5EBE1', accent: '#D4AF37', border: 'rgba(212, 175, 55, 0.35)' },
      { id: 'midnight-gold', name: 'Midnight Onyx', background: '#111116', surface: '#1C1C24', text: '#F5EBE1', accent: '#D4AF37', border: 'rgba(212, 175, 55, 0.35)' },
      { id: 'emerald-gold', name: 'Imperial Emerald', background: '#0C1C14', surface: '#142B20', text: '#FAF4EC', accent: '#D4AF37', border: 'rgba(212, 175, 55, 0.35)' },
    ],
    tags: ['Deep Crimson Velvet', 'Scalloped Parchment', 'Floral Still-Life', 'Dress Code Palette', 'Wax Seal Details'],
    previewImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80',
    aestheticNotes: 'Dramatic dark burgundy-maroon background, white gloved wax seal envelope, scalloped vintage paper cards, vertical beaded timeline, and color dress code swatches.'
  },
  {
    id: 'modern-botanical',
    title: 'Modern Botanical',
    subtitle: 'Organic Warmth & Contemporary Whitespace',
    description: 'A harmonious blend of warm neutrals, delicate olive and sage botanicals, and airy asymmetrical editorial layouts. Perfect for garden weddings and intimate celebrations.',
    paletteTheme: {
      background: '#F9F8F5',
      surface: '#FFFFFF',
      text: '#272E27',
      accent: '#4A5B45',
      border: 'rgba(74, 91, 69, 0.15)',
      badge: 'Warm Neutrals & Sage',
    },
    colorVariants: [
      { id: 'sage-olive', name: 'Sage & Olive', background: '#F9F8F5', surface: '#FFFFFF', text: '#272E27', accent: '#4A5B45', border: 'rgba(74, 91, 69, 0.2)' },
      { id: 'terracotta-warm', name: 'Warm Terracotta', background: '#FAF5F0', surface: '#FFFFFF', text: '#36231C', accent: '#A05844', border: 'rgba(160, 88, 68, 0.2)' },
      { id: 'eucalyptus-slate', name: 'Eucalyptus Slate', background: '#F4F7F6', surface: '#FFFFFF', text: '#1F2A28', accent: '#3E5C56', border: 'rgba(62, 92, 86, 0.2)' },
    ],
    tags: ['Botanical Embellishments', 'Warm Neutral', 'Contemporary Layout', 'Organic Luxury'],
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    aestheticNotes: 'Earthy warmth, minimalist organic laurel illustrations, fine double borders, and soft daylight photography.'
  },
  {
    id: 'dark-luxury',
    title: 'Dark Luxury',
    subtitle: 'Cinematic Espresso & Burnished Muted Gold',
    description: 'An evocative evening aesthetic dressed in deep espresso tones, velvet burgundy highlights, and burnished muted gold typography. Tailored for candlelit receptions and black-tie galas.',
    paletteTheme: {
      background: '#1E0E13',
      surface: '#2A151B',
      text: '#F6F0E6',
      accent: '#C7A66A',
      border: 'rgba(199, 166, 106, 0.28)',
      badge: 'Espresso & Burnished Gold',
    },
    colorVariants: [
      { id: 'espresso-gold', name: 'Burnished Gold', background: '#1E0E13', surface: '#2A151B', text: '#F6F0E6', accent: '#C7A66A', border: 'rgba(199, 166, 106, 0.35)' },
      { id: 'midnight-bronze', name: 'Antique Bronze', background: '#151416', surface: '#201F22', text: '#F6F0E6', accent: '#B88656', border: 'rgba(184, 134, 86, 0.35)' },
      { id: 'plum-noir', name: 'Plum Royale', background: '#1B0E1B', surface: '#281528', text: '#F8EEF8', accent: '#B872A5', border: 'rgba(184, 114, 165, 0.35)' },
    ],
    tags: ['Midnight Atmosphere', 'Burnished Gold', 'Cinematic Photography', 'Black-Tie Editorial'],
    previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
    aestheticNotes: 'High-contrast drama, gold foil accents, deep espresso backgrounds, and intimate golden-hour photography.'
  }
];

export const DEMO_COUPLE: WeddingData = {
  couple: {
    groom: {
      fullName: 'Raden Aditya Wicaksono, B.Eng',
      shortName: 'Aditya',
      father: 'Mr. Bambang Wicaksono',
      mother: 'Mrs. Sri Rahayu',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    bride: {
      fullName: 'Amara Putri Danasasmita, B.A.',
      shortName: 'Amara',
      father: 'Mr. Hendra Danasasmita',
      mother: 'Mrs. Ratna Sari',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    },
    monogram: 'A & A',
    quote: 'Two souls with but a single thought, two hearts that beat as one.',
    quoteSource: 'John Keats',
    storyNarrative: 'From university halls in Bandung to quiet seaside sunsets, our seven years together have been a tapestry of quiet laughter, unwavering support, and mutual reverence. We invite you to witness the beginning of our forever.',
  },
  event: {
    dateFormatted: 'Saturday, November 28, 2026',
    dayOfWeek: 'Saturday',
    timeFormatted: '09:00 AM – 02:00 PM WIB',
    calendarDate: '2026-11-28',
    holyMatrimony: {
      title: 'Akad Nikah / Holy Matrimony',
      time: '09:00 AM – 10:30 AM WIB',
      venue: 'The Glasshouse at Plataran Dharmawangsa',
      address: 'Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan',
    },
    reception: {
      title: 'Wedding Reception',
      time: '11:30 AM – 02:00 PM WIB',
      venue: 'The Grand Ballroom at Plataran',
      address: 'Jl. Dharmawangsa Raya No. 6, Kebayoran Baru, Jakarta Selatan',
    },
  },
  heroPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  galleryPhotos: [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
  ],
};
