# WishVerse — Authentication module

Production authentication for WishVerse: Firebase Auth + Firestore, username
login, Google sign-in, a multi-theme **liquid-glass** UI, an advanced
onboarding flow, and an admin console. Built on Next.js App Router, TypeScript,
Tailwind v4, React Hook Form, Zod, GSAP, Framer Motion, and Zustand.

## Quick start

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local   # fill in your Firebase web config
npm run dev
```

Then in the Firebase Console:

1. **Authentication → Sign-in method** — enable **Email/Password** and **Google**.
2. **Firestore Database** — create it, then publish the rules in `firestore.rules`.
3. **Storage** — publish the rules in `storage.rules` (used for avatar uploads).
4. Add your dev domain to **Authentication → Settings → Authorized domains**.

To make yourself an admin, set `role: "admin"` on your `/users/{uid}` document.

## Themes

Three themes ship out of the box, switched via `[data-theme]` on `<html>`:
**Nebula** (deep-space blue, default), **Cosmos** (violet, high-contrast), and
**Aurora** (starlit light). The liquid-glass material (frosted refraction,
specular sheen, and real floating water-droplet lenses) is defined in
`src/app/globals.css` and adapts to every theme.

## Auth flows

- **Email + password** and **username + password** — usernames are resolved to
  their account email through the `/usernames/{handle}` registry, then signed in
  with Firebase Auth.
- **Google** popup — existing users get `lastLogin` bumped; new users get a
  profile and an auto-generated unique username, then land in onboarding.
- **Registration** reserves the username and creates the profile atomically in a
  Firestore transaction (no race conditions on a handle).
- Live username availability (debounced), password strength meter, email
  verification with resend cooldown, forgot/reset password, and a 6-step
  onboarding flow (avatar, profile, theme, plan).

## Route protection

`src/middleware.ts` gates routes by the `wishverse_session` cookie (set by the
auth provider on sign-in): guests can't reach `/dashboard` or `/admin`, and
signed-in users are bounced off `/login` and `/register`. Client guards
(`useRequireAuth`) additionally enforce verification, onboarding, and admin role.

> For cryptographic session verification at the edge, swap the cookie-presence
> check for Firebase **session cookies** minted by the Admin SDK in a Node route
> handler. The client cookie here is for fast route gating; Firestore rules are
> the real authorization boundary.

## Structure

```
src/
  app/
    (auth)/{login,register,forgot-password,reset-password,
            verify-email,complete-profile,onboarding}/page.tsx
    (protected)/dashboard/{,settings,wishes}/page.tsx
    admin/{,users}/page.tsx
    page.tsx  layout.tsx  globals.css
  components/
    auth/          login/register/forgot/reset/verify forms, username checker,
                   password input + strength, google button, avatar picker, shells
    onboarding/    advanced multi-step flow + shell
    admin/         users table with role/plan/status controls
    app/           protected app shell (sidebar, user menu)
    brand/         logo, starfield, liquid background
    theme/         theme toggle
    providers/     auth provider, theme provider, toast
    ui/            button, input, label, checkbox, card, field-error
  hooks/           useAuth, useUser, useRequireAuth, useDebounce, username availability
  lib/
    firebase/      firebase.ts, auth.ts, firestore.ts, users.ts
    validations/   zod schemas + password strength
    auth-actions.ts  errors.ts  constants.ts  utils.ts
  store/           auth-store.ts, theme-store.ts
  types/           user.ts
firestore.rules  storage.rules  middleware.ts
public/  favicon.svg  icon.svg  apple-icon.svg  manifest.webmanifest
```

## Branding

`public/favicon.svg`, `icon.svg`, and `apple-icon.svg` are a scalable recreation
of the WishVerse star identity. Drop your original PNGs into `/public` to
replace them — see `public/BRANDING.md`.

## Validation

```bash
npm run typecheck   # tsc --noEmit — clean
npm run build       # next build — 18 routes, prerenders green
```
