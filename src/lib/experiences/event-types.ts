import type { EventType } from "@/types/experience";
import type { ThemeId } from "@/lib/constants";

export interface EventTypeMeta {
  id: EventType;
  label: string;
  emoji: string;
  tagline: string;
  gradient: string; // tailwind gradient classes
  defaultTheme: ThemeId;
}

export const EVENT_TYPES: EventTypeMeta[] = [
  {
    id: "birthday",
    label: "Birthday",
    emoji: "🎂",
    tagline: "Make their day unforgettable",
    gradient: "from-[#ff8fb1] to-[#a06bff]",
    defaultTheme: "cosmos",
  },
  {
    id: "anniversary",
    label: "Anniversary",
    emoji: "💞",
    tagline: "Celebrate the journey together",
    gradient: "from-[#ff6f9c] to-[#ff9d6b]",
    defaultTheme: "nebula",
  },
  {
    id: "wedding",
    label: "Wedding",
    emoji: "💍",
    tagline: "Invite the world to your love",
    gradient: "from-[#c9a6ff] to-[#74e6ff]",
    defaultTheme: "aurora",
  },
  {
    id: "proposal",
    label: "Proposal",
    emoji: "💐",
    tagline: "Ask the big question, beautifully",
    gradient: "from-[#ff7aa8] to-[#8f6bff]",
    defaultTheme: "cosmos",
  },
  {
    id: "graduation",
    label: "Graduation",
    emoji: "🎓",
    tagline: "Honor the achievement",
    gradient: "from-[#6d8bff] to-[#74e6ff]",
    defaultTheme: "nebula",
  },
  {
    id: "babyShower",
    label: "Baby Shower",
    emoji: "🍼",
    tagline: "Welcome the little one",
    gradient: "from-[#9fd8ff] to-[#c9a6ff]",
    defaultTheme: "aurora",
  },
  {
    id: "farewell",
    label: "Farewell",
    emoji: "🌟",
    tagline: "A send-off to remember",
    gradient: "from-[#8f6bff] to-[#5b8def]",
    defaultTheme: "nebula",
  },
  {
    id: "festival",
    label: "Festival",
    emoji: "🎉",
    tagline: "Spread the celebration",
    gradient: "from-[#ffb36b] to-[#ff6f9c]",
    defaultTheme: "cosmos",
  },
  {
    id: "memory",
    label: "Memory Album",
    emoji: "📸",
    tagline: "Relive the best moments",
    gradient: "from-[#74e6ff] to-[#6d8bff]",
    defaultTheme: "nebula",
  },
  {
    id: "invitation",
    label: "Invitation",
    emoji: "✨",
    tagline: "Bring everyone together",
    gradient: "from-[#a06bff] to-[#74e6ff]",
    defaultTheme: "cosmos",
  },
  {
    id: "custom",
    label: "Something Else",
    emoji: "🪄",
    tagline: "Start from a blank canvas",
    gradient: "from-[#6d8bff] to-[#9d7bff]",
    defaultTheme: "nebula",
  },
];

export const EVENT_TYPE_MAP: Record<EventType, EventTypeMeta> = Object.fromEntries(
  EVENT_TYPES.map((e) => [e.id, e]),
) as Record<EventType, EventTypeMeta>;
