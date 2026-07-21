import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firestore";
import type {
  Experience,
  ExperienceFilter,
  ExperiencePrivacy,
  ExperienceStatus,
  GuestbookEntry,
  Page,
} from "@/types/experience";
import type { EventType } from "@/types/experience";
import type { ThemeId } from "@/lib/constants";
import { EVENT_TYPE_MAP } from "@/lib/experiences/event-types";
import { makeSlug, starterPages } from "@/lib/experiences/factory";

export const EXPERIENCES = "experiences";

export interface CreateExperienceInput {
  ownerUid: string;
  ownerName: string;
  title: string;
  eventType: EventType;
  recipient: { name: string; relationship: string };
  theme?: ThemeId;
  targetDate?: string | null;
  privacy?: ExperiencePrivacy;
}

function colRef() {
  return collection(db, EXPERIENCES);
}

export async function createExperience(
  input: CreateExperienceInput,
): Promise<string> {
  const meta = EVENT_TYPE_MAP[input.eventType];
  const theme = input.theme ?? meta.defaultTheme;
  const pages: Page[] = starterPages(input.eventType, input.recipient.name);

  const ref = await addDoc(colRef(), {
    ownerUid: input.ownerUid,
    ownerName: input.ownerName,
    title: input.title.trim() || `${meta.label} experience`,
    slug: makeSlug(input.title),
    theme,
    eventType: input.eventType,
    recipient: {
      name: input.recipient.name.trim(),
      relationship: input.recipient.relationship.trim(),
    },
    countdown: {
      enabled: Boolean(input.targetDate),
      targetDate: input.targetDate ?? null,
      label: `Counting down to the ${meta.label.toLowerCase()}`,
    },
    status: "draft" as ExperienceStatus,
    privacy: input.privacy ?? "unlisted",
    favorite: false,
    cover: null,
    pages,
    sharedWith: [],
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: null,
  });

  return ref.id;
}

export async function getExperience(id: string): Promise<Experience | null> {
  const snap = await getDoc(doc(db, EXPERIENCES, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Experience, "id">) };
}

export async function getExperienceBySlug(
  slug: string,
): Promise<Experience | null> {
  const snap = await getDocs(
    query(colRef(), where("slug", "==", slug), limit(1)),
  );
  const d = snap.docs[0];
  if (!d) return null;
  return { id: d.id, ...(d.data() as Omit<Experience, "id">) };
}

export async function listExperiences(
  uid: string,
  filter: ExperienceFilter,
): Promise<Experience[]> {
  const map = (arr: { id: string; data: () => unknown }[]) =>
    arr.map((d) => ({ id: d.id, ...(d.data() as Omit<Experience, "id">) }));

  if (filter === "shared") {
    const snap = await getDocs(
      query(colRef(), where("sharedWith", "array-contains", uid)),
    );
    return map(snap.docs).sort(byUpdated);
  }

  const base = [where("ownerUid", "==", uid)];
  if (filter === "drafts") base.push(where("status", "==", "draft"));
  if (filter === "published") base.push(where("status", "==", "published"));
  if (filter === "archived") base.push(where("status", "==", "archived"));
  if (filter === "favorites") base.push(where("favorite", "==", true));

  const snap = await getDocs(query(colRef(), ...base));
  const rows = map(snap.docs);
  // "all" hides archived by default; others already filtered.
  const visible =
    filter === "all" ? rows.filter((r) => r.status !== "archived") : rows;
  return visible.sort(byUpdated);
}

function byUpdated(a: Experience, b: Experience) {
  const av = a.updatedAt instanceof Timestamp ? a.updatedAt.toMillis() : 0;
  const bv = b.updatedAt instanceof Timestamp ? b.updatedAt.toMillis() : 0;
  return bv - av;
}

export async function updateExperience(
  id: string,
  patch: Partial<Omit<Experience, "id">>,
): Promise<void> {
  await updateDoc(doc(db, EXPERIENCES, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

export async function setStatus(
  id: string,
  status: ExperienceStatus,
): Promise<void> {
  await updateExperience(id, {
    status,
    ...(status === "published"
      ? { publishedAt: serverTimestamp() as unknown as Timestamp }
      : {}),
  });
}

export async function setFavorite(id: string, favorite: boolean): Promise<void> {
  await updateExperience(id, { favorite });
}

export async function duplicateExperience(
  source: Experience,
  ownerUid: string,
  ownerName: string,
): Promise<string> {
  const ref = await addDoc(colRef(), {
    ownerUid,
    ownerName,
    title: `${source.title} (copy)`,
    slug: makeSlug(source.title),
    theme: source.theme,
    eventType: source.eventType,
    recipient: source.recipient,
    countdown: source.countdown,
    status: "draft" as ExperienceStatus,
    privacy: source.privacy,
    favorite: false,
    cover: source.cover,
    pages: source.pages,
    sharedWith: [],
    views: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: null,
  });
  return ref.id;
}

export async function deleteExperience(id: string): Promise<void> {
  await deleteDoc(doc(db, EXPERIENCES, id));
}

export async function incrementViews(id: string): Promise<void> {
  await updateDoc(doc(db, EXPERIENCES, id), { views: increment(1) }).catch(
    () => void 0,
  );
}

/* ---------------- Guestbook ---------------- */

export async function addGuestbookEntry(
  experienceId: string,
  name: string,
  message: string,
): Promise<void> {
  await addDoc(collection(db, EXPERIENCES, experienceId, "guestbook"), {
    name: name.trim().slice(0, 60) || "Anonymous",
    message: message.trim().slice(0, 500),
    createdAt: serverTimestamp(),
  });
}

export async function listGuestbook(
  experienceId: string,
): Promise<GuestbookEntry[]> {
  const snap = await getDocs(
    query(
      collection(db, EXPERIENCES, experienceId, "guestbook"),
      orderBy("createdAt", "desc"),
      limit(100),
    ),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<GuestbookEntry, "id">),
  }));
}

/** Ensure a slug-based read works even before first save (used by editor). */
export async function ensureExperienceDoc(
  id: string,
  data: Partial<Experience>,
): Promise<void> {
  await setDoc(doc(db, EXPERIENCES, id), data, { merge: true });
}
