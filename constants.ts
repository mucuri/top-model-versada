import { StyleOption } from './types';

export const APP_NAME = "Top Model AI";
export const COOLDOWN_MINUTES = 10;

// Note: The 'name' property is now a translation key defined in translations.ts
export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'eclectic',
    name: 'style_eclectic',
    prompt: 'Eclectic and extravagant high fashion style, with bold patterns and vintage accessories, in a lavish Italian villa setting.',
  },
  {
    id: 'glamour',
    name: 'style_glamour',
    prompt: 'Bold and glamorous high fashion style, featuring vibrant prints and gold hardware, on a luxury yacht in Miami.',
  },
  {
    id: 'classic',
    name: 'style_classic',
    prompt: 'Timeless and elegant haute couture, with classic silhouettes and romantic details, in a Parisian garden in full bloom.',
  },
  {
    id: 'sporty',
    name: 'style_sporty',
    prompt: 'Athletic and futuristic sportswear style, technical fabrics and dynamic design, in an urban concrete skatepark.',
  },
  {
    id: 'sicilian',
    name: 'style_sicilian',
    prompt: 'Passionate and Sicilian-inspired high fashion style, with floral prints and dramatic lace, in a vibrant street market in Sicily.',
  },
   {
    id: 'minimalist',
    name: 'style_minimalist',
    prompt: 'Minimalist and intellectual high fashion style, clean lines and innovative technical fabrics, in a modern art gallery with stark white walls.',
  },
];