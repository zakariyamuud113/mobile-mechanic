# Mobile Mechanic — Cross-Cutting Foundation Pass

The prototype skeleton for all three roles already exists. This plan does the work that touches **Customer + Mechanic + Admin together**, in the order you chose. No backend yet (front-end prototype), no strategy docs yet.

## 1. Rebrand: RoadReady → Mobile Mechanic

Replace the name everywhere it's baked in (6 files):
- `src/routes/__root.tsx` — title, meta description, author, og:title/description
- `src/routes/index.tsx` — landing header, hero copy, footer
- `src/routes/admin.tsx` — sidebar wordmark
- `src/components/mobile-shell.tsx` — top-left back label
- `src/routes/mechanic.profile.tsx` — "approved by" copy

### Real logo / wordmark
- Generate a square brand mark (wrench + location-pin motif in the sleek-dark palette) and save it as an asset.
- Build a shared `<Brand />` component (mark + "Mobile Mechanic" wordmark, size variants) used in **all three** shells so branding is identical across Customer, Mechanic, and Admin.
- Wire it as the favicon in `__root.tsx` and delete the default `public/favicon.ico`.

## 2. Shared branding & headers (cross-cutting)

- Introduce the `<Brand />` component above and drop it into: the mobile shell top bar (Customer + Mechanic), the Admin sidebar, and the landing header/footer.
- Standardize the role-accent chip and header spacing so the three shells read as one product family.

## 3. Auth & onboarding shell (front-end only)

- New `/` entry that presents **role selection**: "I need help" (Customer), "I'm a mechanic" (Mechanic), "Admin console".
- Add a lightweight `/auth` route with a mock phone-number + OTP style sign-in screen (Uganda-forward, e.g. +256), leading into the chosen role. No real auth — a mock "current user" held in a shared client store.
- Each role landing greets the mock signed-in user by name.

## 4. Shared data & flows (cross-cutting)

- Upgrade `src/lib/mock-data.ts` into a small shared client store (React context + reducer) so state is live across roles in one session:
  - A job requested by the **Customer** appears in the **Mechanic**'s nearby-jobs feed.
  - When the Mechanic accepts/updates status, the Customer's tracking screen and the **Admin** live-jobs board reflect the same job.
  - A single source of truth for job status transitions (`requested → accepted → en-route → arrived → in-progress → completed`).
- Keep the existing UI screens; rewire them to read/write the shared store instead of static arrays.

## Out of scope for this pass
- Real backend (auth, database, live GPS, Mobile Money) — planned as the next phase once flows feel right.
- Written strategy deliverables (architecture, monetization, GTM, risk) — held off per your choice.

## Technical notes
- Shared store lives in a `JobProvider` mounted in `__root.tsx`; roles consume via hooks. State is in-memory (resets on reload) — appropriate for a prototype and a clean swap point for the real backend later.
- `<Brand />` and role-accent styling use existing semantic tokens in `src/styles.css`; no hardcoded colors.
