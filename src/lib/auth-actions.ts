import {
  applyPersistence,
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  signOut,
  sendVerification,
  setDisplayName,
} from "@/lib/firebase/auth";
import {
  createUserProfile,
  resolveEmailFromUsername,
  ensureProfileForSocial,
  isUsernameAvailable,
  touchLastLogin,
} from "@/lib/firebase/users";
import type { UserProfile } from "@/types/user";
import type { RegisterValues } from "@/lib/validations/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sign in with either an email or a username, plus password. */
export async function loginWithIdentifier(
  identifier: string,
  password: string,
  remember: boolean,
) {
  await applyPersistence(remember);
  const id = identifier.trim();
  const email = EMAIL_RE.test(id) ? id : await resolveEmailFromUsername(id);
  const cred = await signInWithEmail(email, password);
  await touchLastLogin(cred.user.uid);
  return cred.user;
}

/** Full registration: create auth user, reserve username, create profile, send verification. */
export async function registerUser(values: RegisterValues): Promise<UserProfile> {
  const available = await isUsernameAvailable(values.username);
  if (!available) throw { code: "username/taken" };

  const cred = await registerWithEmail(values.email, values.password);
  await setDisplayName(cred.user, values.displayName);

  const profile = await createUserProfile({
    user: cred.user,
    username: values.username.toLowerCase(),
    displayName: values.displayName,
    provider: "password",
  });

  await sendVerification(cred.user).catch(() => void 0);
  return profile;
}

/** Google popup sign-in; creates a profile + auto username for new users. */
export async function loginWithGoogle(remember = true) {
  await applyPersistence(remember);
  const cred = await signInWithGoogle();
  const { profile, isNew } = await ensureProfileForSocial(cred.user);
  return { user: cred.user, profile, isNew };
}

export async function logout() {
  await signOut();
}
