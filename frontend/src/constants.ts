export const FEED_DEFAULT_LIMIT = 20;

export const SUPPORTED_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'ru', 'zh', 'ar', 'ja', 'ko',
] as const;

export const USER_MENU_LINKS = [
  { label: 'Home',      to: '/'         },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Saved',     to: '/saved'     },
  { label: 'Profile',   to: '/profile'   },
] as const;

export const TOPICS = [
  'Technology',
  'Politics',
  'Business',
  'Health',
  'Sports',
  'Entertainment',
  'Science',
  'World',
] as const;

export type Topic = typeof TOPICS[number];
