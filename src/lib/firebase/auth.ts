import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  applyActionCode,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User as FirebaseUser,
  type UserCredential,
} from "firebase/auth";
import { firebaseApp } from "./firebase";

export const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export type { FirebaseUser, UserCredential };

/** Choose persistence based on the "remember me" toggle. */
export async function applyPersistence(remember: boolean) {
  await setPersistence(
    auth,
    remember ? browserLocalPersistence : browserSessionPersistence,
  );
}

export function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function registerWithEmail(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOut() {
  return fbSignOut(auth);
}

export function sendVerification(user: FirebaseUser) {
  if (typeof window !== "undefined") {
    return sendEmailVerification(user, {
      url: `${window.location.origin}/login`,
    });
  }
  return sendEmailVerification(user);
}

export function requestPasswordReset(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function confirmReset(code: string, newPassword: string) {
  return confirmPasswordReset(auth, code, newPassword);
}

export function verifyResetCode(code: string) {
  return verifyPasswordResetCode(auth, code);
}

export function applyEmailAction(code: string) {
  return applyActionCode(auth, code);
}

export function setDisplayName(user: FirebaseUser, displayName: string, photoURL?: string) {
  return updateProfile(user, { displayName, photoURL: photoURL ?? user.photoURL });
}
