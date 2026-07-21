import type { Timestamp } from "firebase/firestore";
import type { ThemeId } from "@/lib/constants";

export type ExperienceStatus = "draft" | "published" | "archived";
export type ExperiencePrivacy = "public" | "unlisted" | "private";

export type EventType =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "proposal"
  | "graduation"
  | "babyShower"
  | "farewell"
  | "festival"
  | "memory"
  | "invitation"
  | "custom";

export interface Recipient {
  name: string;
  relationship: string;
}

export interface Countdown {
  enabled: boolean;
  targetDate: string | null;
  label: string;
}

export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "button"
  | "countdown"
  | "divider"
  | "spacer"
  | "emoji"
  | "gallery"
  | "timeline"
  | "quiz"
  | "spinwheel"
  | "guestbook";

export type AnimationType =
  | "none"
  | "fade"
  | "slideUp"
  | "slideLeft"
  | "zoom"
  | "float";

export interface AnimationConfig {
  type: AnimationType;
  delay: number;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  body: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

/** A superset of props across all block types (kept flat + strongly optional). */
export interface BlockProps {
  text?: string;
  level?: 1 | 2 | 3;
  align?: "left" | "center" | "right";
  color?: string;
  size?: number;
  weight?: number;
  url?: string;
  href?: string;
  caption?: string;
  height?: number;
  emoji?: string;
  targetDate?: string | null;
  items?: TimelineItem[];
  questions?: QuizQuestion[];
  segments?: string[];
  images?: string[];
  prompt?: string;
  radius?: number;
  maxWidth?: number;
}

export interface Block {
  id: string;
  type: BlockType;
  props: BlockProps;
  animation: AnimationConfig;
}

export interface Page {
  id: string;
  name: string;
  background: string;
  blocks: Block[];
}

export interface Experience {
  id: string;
  ownerUid: string;
  ownerName: string;
  title: string;
  slug: string;
  theme: ThemeId;
  eventType: EventType;
  recipient: Recipient;
  countdown: Countdown;
  status: ExperienceStatus;
  privacy: ExperiencePrivacy;
  favorite: boolean;
  cover: string | null;
  pages: Page[];
  sharedWith: string[];
  views: number;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  publishedAt: Timestamp | null;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: Timestamp | null;
}

/** Filters surfaced in the experiences library. */
export type ExperienceFilter =
  | "all"
  | "drafts"
  | "published"
  | "archived"
  | "favorites"
  | "shared";
