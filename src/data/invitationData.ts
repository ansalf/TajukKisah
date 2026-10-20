// Extended Mock Data & Config for Complete Wedding Invitation (Aditya & Amara)

export interface StoryMilestone {
  year: string;
  title: string;
  location: string;
  narrative: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
}

export interface PhysicalGiftAddress {
  recipient: string;
  address: string;
  phone: string;
  note: string;
}

export interface GuestWish {
  id: string;
  name: string;
  relationship: string;
  message: string;
  attendance: 'attending' | 'regret' | 'tentative';
  timestamp: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location?: string;
}

export const WEDDING_STORY_TIMELINE: StoryMilestone[] = [
  {
    year: '2019',
    title: 'The First Encounter',
    location: 'Bandung Institute of Technology',
    narrative: 'A shared table in the campus design library, over notes on architectural structures and quiet cups of filter coffee. What started as borrowed books blossomed into hours of effortless conversation.'
  },
  {
    year: '2021',
    title: 'Across the Waters',
    location: 'Singapore & Jakarta',
    narrative: 'When Aditya pursued his master\'s overseas, evening letters, handwritten postcards, and synchronized weekend calls anchored their bond through long distances and quiet patience.'
  },
  {
    year: '2024',
    title: 'A Promise at Sunset',
    location: 'Uluwatu Cliffs, Bali',
    narrative: 'Under the golden hour glow overlooking the Indian Ocean, Aditya asked Amara to spend a lifetime together. With tears of joy and full hearts, she said yes.'
  },
  {
    year: '2026',
    title: 'The Eternal Chapter',
    location: 'Jakarta',
    narrative: 'Surrounded by beloved family and cherished friends, we embark on our greatest voyage as husband and wife.'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    alt: 'Aditya and Amara in traditional attire',
    caption: 'Moments of quiet reverence before the ceremony',
    location: 'Jakarta'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    alt: 'Golden hour embrace',
    caption: 'Golden light cascading over Uluwatu cliffs',
    location: 'Bali'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    alt: 'Botanical garden walkway',
    caption: 'Walking hand in hand through the conservatory',
    location: 'Bogor'
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    alt: 'Laughter and shared secrets',
    caption: 'Unfiltered laughter on an autumn afternoon',
    location: 'Bandung'
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    alt: 'Fine wedding bands and flowers',
    caption: 'Bespoke rings engraved with our initials',
    location: 'Jakarta'
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Evening candlelit reception details',
    caption: 'Candlelight illuminating the long banquet tables',
    location: 'Plataran'
  }
];

export const DIGITAL_GIFTS_DATA = {
  description: 'Your presence, blessings, and warm prayers are the greatest gift we could ever ask for. For friends and family who have kindly inquired about extending a token of love, we provide our digital gift accounts below.',
  accounts: [
    {
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8830129481',
      accountHolder: 'Raden Aditya Wicaksono'
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '1370019283741',
      accountHolder: 'Amara Putri Danasasmita'
    }
  ] as BankAccount[],
  physicalGift: {
    recipient: 'Aditya & Amara (Wedding Residence)',
    address: 'Jl. Senopati Suites Tower 2 No. 14A, Kebayoran Baru, Jakarta Selatan 12190',
    phone: '+62 812-9876-5432',
    note: 'Please kindly inform us prior to package arrival.'
  } as PhysicalGiftAddress
};

export const INITIAL_GUEST_WISHES: GuestWish[] = [
  {
    id: 'w1',
    name: 'Dimas & Nadia',
    relationship: 'College Friends',
    message: 'Wishing you both a lifetime of immense joy, patience, and unwavering companionship. Cannot wait to celebrate with you in Jakarta!',
    attendance: 'attending',
    timestamp: '2 hours ago'
  },
  {
    id: 'w2',
    name: 'Uncle Hartono & Family',
    relationship: 'Family',
    message: 'Selamat untuk Aditya dan Amara. Semoga pernikahan ini selalu dinaungi berkah, ketenteraman, dan cinta yang abadi selamanya.',
    attendance: 'attending',
    timestamp: 'Yesterday'
  },
  {
    id: 'w3',
    name: 'Siti Rahmawati',
    relationship: 'Colleague',
    message: 'Sending warmest congratulations from Singapore! So thrilled to see your love story reach this milestone. Wishing you endless happiness.',
    attendance: 'tentative',
    timestamp: '2 days ago'
  }
];

export const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.195045431662!2d106.79782557586824!3d-6.237989393750275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1430dd74457%3A0xbce5c796b4bf2bfa!2sPlataran%20Dharmawangsa!5e0!3m2!1sen!2sid!4v1710900000000!5m2!1sen!2sid';
export const GOOGLE_MAPS_DIRECTION_URL = 'https://maps.google.com/?q=Plataran+Dharmawangsa+Jakarta';

// Curated licensed, royalty-free ambient acoustic tracks for wedding invitations
export interface CuratedTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const CURATED_WEDDING_TRACKS: CuratedTrack[] = [
  {
    id: 'piano-romance',
    title: 'Acoustic Wedding Piano (Romantic & Gentle)',
    artist: 'Pixabay Free Music License',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113222.mp3',
  },
  {
    id: 'classical-strings',
    title: 'Canon in D (Orchestral Strings)',
    artist: 'Johann Pachelbel (Public Domain)',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8872b22.mp3?filename=canon-in-d-major-romantic-10855.mp3',
  },
  {
    id: 'acoustic-guitar-vow',
    title: 'Acoustic Guitar Romance',
    artist: 'Pixabay Free Music License',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=soft-acoustic-guitar-15243.mp3',
  },
];

// Default ambient piano track
export const WEDDING_AUDIO_URL = CURATED_WEDDING_TRACKS[0].url;
