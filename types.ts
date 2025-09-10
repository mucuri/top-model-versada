export enum AppStep {
  LOGIN,
  TERMS_AGREEMENT,
  PROFILE_SETUP,
  SELFIE_CAPTURE,
  STYLE_SELECTION,
  GENERATING,
  MAIN_VIEW,
  PAYMENT_SCREEN, // Renamed from PRO_SCREEN
  INFO_SCREEN,
  PROFILE_SCREEN, // New step for user profile
}

export type Language = 'pt' | 'it' | 'en';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export interface User {
  name: string;
  city: string;
  country: string;
  language: Language;
  selfie: string | null; // base64 string
  hasCompletedSetup?: boolean; // To track onboarding completion
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  author: string;
  authorCity: string; // For privacy-aware display
  authorCountry: string; // For privacy-aware display
  likes: number;
  likedByUser: boolean;
  createdAt: string; // ISO string for expiration tracking
}

export interface StyleOption {
  id: string;
  name: string; // This will now be a translation key
  prompt: string;
}