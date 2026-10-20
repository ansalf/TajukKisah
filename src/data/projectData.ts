import { WeddingData, DEMO_COUPLE } from './mockData';
import {
  StoryMilestone,
  BankAccount,
  PhysicalGiftAddress,
  GalleryItem,
  WEDDING_STORY_TIMELINE,
  GALLERY_ITEMS,
  DIGITAL_GIFTS_DATA,
  GOOGLE_MAPS_DIRECTION_URL,
  GOOGLE_MAPS_EMBED_URL,
  WEDDING_AUDIO_URL,
} from './invitationData';

export interface ProjectInvitation {
  id: string;
  slug: string;
  title: string;
  templateId: 'editorial-romance' | 'modern-botanical' | 'dark-luxury' | 'velvet-noir-editorial';
  status: 'published' | 'draft' | 'archived';
  viewsCount: number;
  rsvpsCount: number;
  lastEdited: string;
  weddingData: WeddingData;
  storyTimeline: StoryMilestone[];
  gallery: GalleryItem[];
  digitalGifts: {
    enabled: boolean;
    description: string;
    accounts: BankAccount[];
    physicalGift: PhysicalGiftAddress;
  };
  features: {
    showRsvp: boolean;
    showGuestWishes: boolean;
    showAudio: boolean;
    audioUrl: string;
    showStory: boolean;
    showGallery: boolean;
    showGift: boolean;
    showCountdown: boolean;
    googleMapsEmbedUrl: string;
    googleMapsDirectionUrl: string;
  };
}

export const INITIAL_PROJECTS: ProjectInvitation[] = [
  {
    id: 'proj-1',
    slug: 'aditya-amara',
    title: 'The Wedding of Aditya & Amara',
    templateId: 'editorial-romance',
    status: 'published',
    viewsCount: 342,
    rsvpsCount: 86,
    lastEdited: 'Just now',
    weddingData: DEMO_COUPLE,
    storyTimeline: WEDDING_STORY_TIMELINE,
    gallery: GALLERY_ITEMS,
    digitalGifts: {
      enabled: true,
      description: DIGITAL_GIFTS_DATA.description,
      accounts: DIGITAL_GIFTS_DATA.accounts,
      physicalGift: DIGITAL_GIFTS_DATA.physicalGift,
    },
    features: {
      showRsvp: true,
      showGuestWishes: true,
      showAudio: true,
      audioUrl: WEDDING_AUDIO_URL,
      showStory: true,
      showGallery: true,
      showGift: true,
      showCountdown: true,
      googleMapsEmbedUrl: GOOGLE_MAPS_EMBED_URL,
      googleMapsDirectionUrl: GOOGLE_MAPS_DIRECTION_URL,
    },
  },
  {
    id: 'proj-2',
    slug: 'bima-clara',
    title: 'The Intimate Garden Nuptials of Bima & Clara',
    templateId: 'modern-botanical',
    status: 'draft',
    viewsCount: 14,
    rsvpsCount: 0,
    lastEdited: '2 days ago',
    weddingData: {
      ...DEMO_COUPLE,
      couple: {
        ...DEMO_COUPLE.couple,
        groom: {
          ...DEMO_COUPLE.couple.groom,
          fullName: 'Bima Satria Nusantara, M.Arch',
          shortName: 'Bima',
        },
        bride: {
          ...DEMO_COUPLE.couple.bride,
          fullName: 'Clara Evelyn Wijaya, B.F.A.',
          shortName: 'Clara',
        },
        monogram: 'B & C',
        quote: 'Love is not about looking at each other, but looking in the same direction.',
        quoteSource: 'Antoine de Saint-Exupéry',
      },
      event: {
        ...DEMO_COUPLE.event,
        dateFormatted: 'Sunday, December 13, 2026',
        dayOfWeek: 'Sunday',
        timeFormatted: '16:00 – 21:00 WIB',
        calendarDate: '2026-12-13',
      },
    },
    storyTimeline: WEDDING_STORY_TIMELINE.slice(0, 3),
    gallery: GALLERY_ITEMS.slice(0, 4),
    digitalGifts: {
      enabled: false,
      description: DIGITAL_GIFTS_DATA.description,
      accounts: DIGITAL_GIFTS_DATA.accounts,
      physicalGift: DIGITAL_GIFTS_DATA.physicalGift,
    },
    features: {
      showRsvp: true,
      showGuestWishes: true,
      showAudio: false,
      audioUrl: WEDDING_AUDIO_URL,
      showStory: true,
      showGallery: true,
      showGift: false,
      showCountdown: true,
      googleMapsEmbedUrl: GOOGLE_MAPS_EMBED_URL,
      googleMapsDirectionUrl: GOOGLE_MAPS_DIRECTION_URL,
    },
  },
];

const LOCAL_STORAGE_KEY = 'tajukkisah_projects_demo';

export const loadProjectsFromStorage = (): ProjectInvitation[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using initial mock projects:', e);
  }
  return INITIAL_PROJECTS;
};

export const saveProjectsToStorage = (projects: ProjectInvitation[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.warn('Could not write to localStorage:', e);
  }
};
