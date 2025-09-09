export enum AppStep {
  LOGIN,
  TERMS_AGREEMENT,
  PROFILE_SETUP,
  SELFIE_CAPTURE,
  STYLE_SELECTION,
  GENERATING,
  MAIN_VIEW,
  PRO_SCREEN,
  INFO_SCREEN, // New step for info
}

export interface User {
  name: string;
  city: string;
  country: string;
  selfie: string | null; // base64 string
  hasCompletedSetup?: boolean; // To track onboarding completion
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  author: string;
  likes: number;
  likedByUser: boolean;
  createdAt: string; // ISO string for expiration tracking
}

export interface StyleOption {
  id: string;
  name: string;
  prompt: string;
  thumbnail: string;
}