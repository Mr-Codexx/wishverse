import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, COLLECTIONS } from "./firestore";
import type {
  UserProfile,
  AuthProviderId,
  UserRole,
  UserPlan,
} from "@/types/user";
import type { FirebaseUser } from "./auth";
import { slugifyUsername } from "@/lib/utils";

function userRef(uid: string) {
  return doc(db, COLLECTIONS.users, uid);
}
function usernameRef(usernameLower: string) {
  return doc(db, COLLECTIONS.usernames, usernameLower);
}

/** Live availability check for a username. */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const lower = username.trim().toLowerCase();
  if (!lower) return false;
  const snap = await getDoc(usernameRef(lower));
  return !snap.exists();
}

/** Resolve a username to its account email so we can sign in with Firebase Auth. */
export async function resolveEmailFromUsername(
  username: string,
): Promise<string> {
  const lower = username.trim().toLowerCase();
  const unameSnap = await getDoc(usernameRef(lower));
  if (!unameSnap.exists()) {
    throw { code: "username/not-found" };
  }
  const { uid } = unameSnap.data() as { uid: string };
  const profileSnap = await getDoc(userRef(uid));
  if (!profileSnap.exists()) {
    throw { code: "username/not-found" };
  }
  return (profileSnap.data() as UserProfile).email;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

interface CreateProfileInput {
  user: FirebaseUser;
  username: string;
  displayName: string;
  provider: AuthProviderId;
}

/**
 * Atomically reserve the username and create the profile.
 * Throws { code: "username/taken" } if the handle was claimed concurrently.
 */
export async function createUserProfile({
  user,
  username,
  displayName,
  provider,
}: CreateProfileInput): Promise<UserProfile> {
  const lower = username.trim().toLowerCase();
  const now = Date.now();

  const profile: UserProfile = {
    uid: user.uid,
    username,
    usernameLower: lower,
    displayName,
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
    provider,
    verified: user.emailVerified,
    role: "user",
    plan: "free",
    status: "active",
    onboarded: false,
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
  };

  await runTransaction(db, async (tx) => {
    const claim = await tx.get(usernameRef(lower));
    if (claim.exists() && (claim.data() as { uid: string }).uid !== user.uid) {
      throw { code: "username/taken" };
    }
    tx.set(usernameRef(lower), {
      uid: user.uid,
      username,
      createdAt: now,
    });
    tx.set(userRef(user.uid), { ...profile, serverTime: serverTimestamp() });
  });

  return profile;
}

/** Ensure a Google/social user has a profile; create one if absent. */
export async function ensureProfileForSocial(
  user: FirebaseUser,
): Promise<{ profile: UserProfile; isNew: boolean }> {
  const existing = await getUserProfile(user.uid);
  if (existing) {
    await touchLastLogin(user.uid);
    return { profile: { ...existing, lastLogin: Date.now() }, isNew: false };
  }

  const username = await generateUniqueUsername(
    user.displayName || user.email?.split("@")[0] || "star",
  );
  const profile = await createUserProfile({
    user,
    username,
    displayName: user.displayName || username,
    provider: "google.com",
  });
  return { profile, isNew: true };
}

/** Build a unique username from a seed, appending digits on collision. */
export async function generateUniqueUsername(seed: string): Promise<string> {
  let base = slugifyUsername(seed) || "star";
  if (base.length < 3) base = `${base}star`.slice(0, 20);
  base = base.slice(0, 16);

  if (await isUsernameAvailable(base)) return base;
  for (let i = 0; i < 40; i++) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const candidate = `${base}${suffix}`.slice(0, 20);
    if (await isUsernameAvailable(candidate)) return candidate;
  }
  return `${base}${Date.now().toString().slice(-5)}`.slice(0, 20);
}

export async function touchLastLogin(uid: string) {
  await updateDoc(userRef(uid), {
    lastLogin: Date.now(),
    updatedAt: Date.now(),
  }).catch(() => void 0);
}

export async function updateUserProfile(
  uid: string,
  patch: Partial<UserProfile>,
) {
  await updateDoc(userRef(uid), { ...patch, updatedAt: Date.now() });
}

export async function markOnboarded(uid: string, patch: Partial<UserProfile>) {
  await updateDoc(userRef(uid), {
    ...patch,
    onboarded: true,
    updatedAt: Date.now(),
  });
}

export async function setVerified(uid: string, verified: boolean) {
  await updateDoc(userRef(uid), { verified, updatedAt: Date.now() }).catch(
    () => void 0,
  );
}

/** Admin helper — list users (guarded by Firestore rules to admins). */
export async function listAllUsers(max = 200): Promise<UserProfile[]> {
  const q = query(
    collection(db, COLLECTIONS.users),
    orderBy("createdAt", "desc"),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

/** Admin helper — update role/plan/status. */
export async function adminUpdateUser(
  uid: string,
  patch: Partial<Pick<UserProfile, "role" | "plan" | "status">>,
) {
  await setDoc(userRef(uid), { ...patch, updatedAt: Date.now() }, { merge: true });
}

export type { UserRole, UserPlan };
