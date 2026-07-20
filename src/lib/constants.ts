export const APP_NAME = "WishVerse";
export const APP_TAGLINE = "Create unforgettable experiences";

export const SESSION_COOKIE = "wishverse_session";
export const ONBOARDED_COOKIE = "wishverse_onboarded";

export const THEMES = [
  { id: "nebula", label: "Nebula", hint: "Deep space blue" },
  { id: "cosmos", label: "Cosmos", hint: "Violet high-contrast" },
  { id: "aurora", label: "Aurora", hint: "Starlit light" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const DEFAULT_THEME: ThemeId = "nebula";

export const RESEND_COOLDOWN_SECONDS = 45;
export const USERNAME_DEBOUNCE_MS = 450;

export const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Germany", "France", "Japan", "Singapore", "United Arab Emirates",
  "Brazil", "Netherlands", "Spain", "Italy", "Ireland", "New Zealand",
  "South Africa", "Nigeria", "Kenya", "Mexico", "Other",
];

export const PLANS = [
  { id: "free", label: "Free", tagline: "For getting started" },
  { id: "pro", label: "Pro", tagline: "For serious creators" },
  { id: "studio", label: "Studio", tagline: "For teams and agencies" },
] as const;
