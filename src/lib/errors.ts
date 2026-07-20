/** Maps Firebase Auth error codes to friendly, human copy. */
const MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-disabled": "This account has been disabled. Contact support.",
  "auth/user-not-found": "We couldn't find an account with those details.",
  "auth/wrong-password": "Incorrect password. Try again or reset it.",
  "auth/invalid-credential": "Those credentials don't match. Check and retry.",
  "auth/email-already-in-use": "That email is already registered. Try signing in.",
  "auth/weak-password": "Choose a stronger password (at least 8 characters).",
  "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
  "auth/popup-closed-by-user": "The sign-in window was closed before finishing.",
  "auth/cancelled-popup-request": "Another sign-in is already in progress.",
  "auth/popup-blocked": "Your browser blocked the popup. Allow popups and retry.",
  "auth/account-exists-with-different-credential":
    "An account already exists with this email using a different method.",
  "auth/network-request-failed": "Network trouble. Check your connection.",
  "auth/requires-recent-login": "Please sign in again to continue.",
  "auth/expired-action-code": "This link has expired. Request a new one.",
  "auth/invalid-action-code": "This link is invalid or already used.",
  "auth/missing-password": "Enter your password to continue.",
  "auth/operation-not-allowed": "This sign-in method isn't enabled.",
  "username/taken": "That username is already taken.",
  "username/not-found": "No account matches that username.",
  "offline": "You appear to be offline. Reconnect and try again.",
};

export function friendlyAuthError(err: unknown): string {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return MESSAGES["offline"];
  }
  const code =
    (err as { code?: string })?.code ??
    (typeof err === "string" ? err : undefined);
  if (code && MESSAGES[code]) return MESSAGES[code];
  const message = (err as { message?: string })?.message;
  if (message) {
    const match = message.match(/\(([^)]+)\)/);
    if (match && MESSAGES[match[1]]) return MESSAGES[match[1]];
  }
  return "Something went wrong. Please try again.";
}
