import type {
  Block,
  BlockProps,
  BlockType,
  EventType,
  Page,
} from "@/types/experience";
import { EVENT_TYPE_MAP } from "./event-types";
import { slugifyUsername } from "@/lib/utils";

export function nid(prefix = ""): string {
  return (
    prefix +
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}

export function makeSlug(title: string): string {
  const base = slugifyUsername(title).slice(0, 40) || "experience";
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

const BLOCK_DEFAULTS: Record<BlockType, BlockProps> = {
  heading: { text: "Your headline", level: 1, align: "center", size: 44, weight: 700 },
  text: {
    text: "Write something heartfelt here…",
    align: "center",
    size: 18,
    maxWidth: 640,
  },
  image: { url: "", caption: "", radius: 24, maxWidth: 720 },
  button: { text: "Tap here", href: "#", align: "center" },
  countdown: { targetDate: null, text: "Counting down to the big day" },
  divider: {},
  spacer: { height: 48 },
  emoji: { emoji: "🎉", size: 72 },
  gallery: { images: [] },
  timeline: {
    items: [
      { id: nid(), date: "2020", title: "Where it began", body: "The first chapter." },
      { id: nid(), date: "Today", title: "Here and now", body: "Still going strong." },
    ],
  },
  quiz: {
    text: "How well do you know me?",
    questions: [
      {
        id: nid(),
        question: "What's my favorite color?",
        options: ["Blue", "Violet", "Cyan", "Silver"],
        answerIndex: 1,
      },
    ],
  },
  spinwheel: {
    text: "Spin to reveal your surprise",
    segments: ["A hug", "A song", "A memory", "A wish", "A dance", "A secret"],
  },
  guestbook: { prompt: "Leave a message they'll treasure" },
};

export function createBlock(type: BlockType): Block {
  return {
    id: nid("b_"),
    type,
    props: structuredCloneSafe(BLOCK_DEFAULTS[type]),
    animation: { type: type === "emoji" ? "float" : "slideUp", delay: 0 },
  };
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Build a rich starter page tailored to the chosen event type. */
export function starterPages(
  eventType: EventType,
  recipientName: string,
): Page[] {
  const meta = EVENT_TYPE_MAP[eventType];
  const who = recipientName?.trim() || "someone special";

  const hero = createBlock("emoji");
  hero.props.emoji = meta.emoji;

  const heading = createBlock("heading");
  heading.props.text = `${meta.label} for ${who}`;

  const sub = createBlock("text");
  sub.props.text = meta.tagline + ".";

  const spacer = createBlock("spacer");

  const cta = createBlock("button");
  cta.props.text = "Begin the experience";

  return [
    {
      id: nid("p_"),
      name: "Welcome",
      background: "transparent",
      blocks: [hero, heading, sub, spacer, cta],
    },
  ];
}
