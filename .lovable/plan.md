# Make Mobile Mechanic Live with Firebase

Bring the prototype to life with **real accounts** and **persistent, real-time data** using your Firebase project — all client-side, so we don't stand up a separate backend. Firebase Auth handles logins and Firestore stores every job, profile, and status change with live sync across roles and devices.

## What you'll need to provide
Firebase's **web config** (not the Google Maps key). From Firebase Console → Project Settings → "Your apps" → Web app, you'll copy the config object:
```text
apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
```
These values are publishable (safe in frontend code). You'll also enable **Phone** sign-in under Firebase Console → Authentication → Sign-in method, and add your preview + published domains to the authorized domains list. I'll tell you exactly which domains once we wire it.

## 1. Firebase setup in the app
- Add the `firebase` SDK.
- Create `src/lib/firebase.ts` that initializes the app from your web config and exports `auth` and `db` (Firestore).
- Firebase config is publishable, so it lives in code (with values you provide).

## 2. Real authentication (phone OTP)
- Replace the mock OTP in `src/routes/auth.tsx` with real Firebase **phone auth**:
  - Enter `+256` number → invisible reCAPTCHA → real SMS code → verify.
  - On first sign-in, create/read a `users/{uid}` profile doc holding `name`, `phone`, and `role`.
- Add an auth context (`src/lib/auth-store.tsx`) that tracks the signed-in Firebase user + their profile, replacing the in-memory `currentUser` in `job-store.tsx`.
- Add route guards: Customer/Mechanic/Admin areas redirect to `/auth` when signed out; sign-out actually clears the Firebase session.
- Admin role is granted via a Firestore role field (set manually in the console for your account) — no privilege escalation from the client.

## 3. Persistent, real-time job data (Firestore)
- Convert `src/lib/job-store.tsx` from in-memory state to Firestore-backed:
  - `createJob`, `acceptJob`, `updateJobStatus`, `rateJob` write to a `jobs` collection.
  - Screens subscribe with real-time listeners (`onSnapshot`) so a Customer's new request instantly appears in the Mechanic feed and Admin board, and status changes propagate live — now surviving reloads and syncing across devices.
- Keep the same `ServiceRequest` shape (including `coord`/`mechanicCoord`) so the existing UI and Google Maps live tracking keep working unchanged.
- Seed the initial demo jobs once into Firestore (idempotent) so the boards aren't empty on first run.

## 4. Live location tracking (real-time)
- Mechanic screen writes its live `mechanicCoord` to the active job doc (using the browser Geolocation API while en-route).
- Customer tracking screen reads that coordinate via the Firestore listener and feeds it to the existing `<LiveMap />`, so the moving marker reflects the mechanic's actual position instead of a simulated path.

## Security notes
- I'll include Firestore **security rules** you paste into the console: users read/write only their own profile; customers see their own jobs; mechanics see open + assigned jobs; only admins read everything. This keeps data safe even though access is client-side.
- Phone auth + reCAPTCHA prevents fake accounts.

## Out of scope for this pass
- Mobile Money / payments, push notifications, and the written strategy docs — next phases once the live data flow feels right.

## To start
Once you approve, I'll build steps 1–4. I'll need you to (a) paste your Firebase **web config**, and (b) enable Phone sign-in in the Firebase console — I'll prompt you at the right moment.
