# WishVerse — Authentication module

Production authentication for WishVerse: Firebase Auth + Firestore, username
login, Google sign-in, a multi-theme **liquid-glass** UI, an advanced
onboarding flow, and an admin console. Built on Next.js App Router, TypeScript,
Tailwind v4, React Hook Form, Zod, GSAP, Framer Motion, and Zustand.

## Quick start

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local   # fill in your Firebase config + AI key
npm run dev
```

Then in the Firebase Console:

1. **Authentication → Sign-in method** — enable **Email/Password** and **Google**.
2. **Firestore Database** — create it, then publish the rules in `firestore.rules`.
3. **Storage** — publish the rules in `storage.rules` (used for avatar uploads).
4. Add your dev domain to **Authentication → Settings → Authorized domains**.

For **Aura** (the AI companion), add a `GROQ_API_KEY` to `.env.local` from
console.groq.com. The key stays server-side — Aura is presented as WishVerse's
own AI and never discloses the underlying provider.

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

## Aura — WishVerse's AI companion

**Aura** is the built-in AI creative companion. It helps creators dream up
experiences, write heartfelt copy, suggest themes and structure, and design
interactive games. It appears two ways: a **floating companion** on every
dashboard screen, and a full **studio page** at `/dashboard/aura`.

- **Server-proxied** — all inference runs through `POST /api/ai/chat` (Node
  runtime). The API key never reaches the browser, and the model streams token
  by token back to the client.
- **White-labeled** — the system prompt in `src/lib/ai/prompts.ts` keeps Aura
  in-brand and instructs it never to name or hint at the underlying provider or
  model. To the user, Aura is WishVerse's own AI. Swapping providers is a
  one-file change in `src/lib/ai/groq.ts` — the UI never changes.
- **Guardrails** — per-IP sliding-window rate limiting (`src/lib/ai/rate-limit.ts`),
  history clamping, and graceful empty/error/streaming states. For multi-instance
  production, swap the in-memory limiter for Upstash Redis (same interface).

## Full-width desktop

The authenticated app shell (`src/components/app/app-shell.tsx`) fills 100% of
the viewport: the glass sidebar is pinned flush-left and the content region
flexes to fill the remaining space (wider sidebar at `xl`). It was previously
capped at `max-w-7xl` and centered — that constraint is removed.

## The Experience system (core product)

WishVerse is an **Experience Creation Platform** — think Canva for interactive,
shareable celebrations. After login users land on **`/home`**, a creation hub
(not a dashboard), and everything centers on making and managing *Experiences*.

**Library & filters** — `/experiences` lists everything with tabs for **All,
Drafts, Published, Favorites, Archived, and Shared With Me**. Each card supports
edit, preview, duplicate, favorite, publish/unpublish, archive/restore, copy
share link, and delete.

**Create wizard** — `/experiences/new` walks through Occasion → Details → Theme
→ Date & Privacy → Review, then writes the doc to Firestore and redirects
straight into the editor with a tailored starter canvas.

**The Experience Editor** (`/experience/[id]/edit`) is the heart of the app: a
full-screen, three-pane studio.
- *Left panel* — an Elements palette (heading, text, image, button, countdown,
  emoji, gallery, timeline, quiz, spin wheel, guestbook, divider, spacer) and a
  drag-reorderable Pages manager.
- *Canvas* — a section-based, drag-to-reorder canvas with per-block controls
  (move, duplicate, delete) and live selection.
- *Inspector* — context-aware property editing for every block type, per-block
  entrance animations, plus experience-level settings (recipient, countdown,
  privacy, page background, share link).
- *Autosave* — changes persist to Firestore on a debounced 1.2s cycle with a
  live save indicator; Publish/Unpublish and Share live in the top bar.

**Interactive blocks** — countdown (live ticking), timeline, quiz (scored),
spin wheel (animated SVG), gallery, and guestbook. The guestbook writes visitor
entries to a Firestore subcollection.

**Public share pages** — every experience gets a link at **`/e/[slug]`** that
renders the pages full-screen with entrance animations and respects privacy
(public/unlisted are viewable by link; private shows a locked notice). View
counts increment on load.

**Data & rules** — experiences live in the `experiences` collection with a
`guestbook` subcollection; CRUD is in `src/lib/firebase/experiences.ts`, the
editor state in `src/store/editor-store.ts`. Firestore rules restrict writes to
the owner, allow public/unlisted/shared reads, and permit guestbook signing.
The owner-scoped list queries use composite indexes — Firestore will surface a
one-click "create index" link the first time each query runs.

> Fixed, always-expanded **320px** sidebar on desktop (never auto-collapses);
> a slide-in **drawer** on mobile. The pre-existing dashboard, admin, auth, AI,
> and theme systems are untouched.

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
