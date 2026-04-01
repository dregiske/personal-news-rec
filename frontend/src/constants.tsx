import type { CarouselItem } from "./components/Carousel";

export const APP_NAME = 'The Fray';
export const APP_SHORT_NAME = 'Fray';
export const APP_TAGLINE = 'Your world, curated.';

export const FEED_DEFAULT_LIMIT = 20;

export const DEFAULT_DURATION = 28;

export const USERNAME_CONSECUTIVE_SPECIAL = /[_-]{2,}/;
export const USERNAME_VALID = /^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$/;

export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "pt",
  "nl",
  "ru",
  "zh",
  "ar",
  "ja",
  "ko",
] as const;

export const USER_MENU_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Saved", to: "/saved" },
  { label: "Profile", to: "/profile" },
] as const;

export const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Saved", to: "/saved" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log in", to: "/login" },
      { label: "Sign up", to: "/signup" },
      { label: "Profile", to: "/profile" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
] as const;

export const HOME_FEATURES: CarouselItem[] = [
  {
    headline: "Built around you",
    body: "Your feed adapts to every article you read, save, and react to. The sharper your engagement, the better it gets.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
        />
      </svg>
    ),
  },
  {
    headline: "Never lose a story",
    body: "Bookmark anything with one tap. Your saved articles are organized and ready whenever you are.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    ),
  },
  {
    headline: "Own your topics",
    body: "Choose the subjects that matter — from global politics to niche tech. Your preferences shape every recommendation.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 6h.008v.008H6V6Z"
        />
      </svg>
    ),
  },
  {
    headline: "React to refine",
    body: "Like it, skip it, save it. Every reaction teaches your feed what to surface — and what to leave behind.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
        />
      </svg>
    ),
  },
  {
    headline: "Fresh every day",
    body: "Curated from sources across the web, updated continuously. Your morning briefing is always waiting.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
        />
      </svg>
    ),
  },
];

export const TOPICS = [
  "Technology",
  "Politics",
  "Business",
  "Health",
  "Sports",
  "Entertainment",
  "Science",
  "World",
] as const;

export type Topic = (typeof TOPICS)[number];
