import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type ConfirmationResult,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseAuth, getDb, isFirebaseConfigured } from "./firebase";

export type Role = "customer" | "mechanic" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
}

interface AuthStore {
  configured: boolean;
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  /** Send an SMS code to a full E.164 number, e.g. "+256700000000". */
  sendOtp: (phoneE164: string) => Promise<void>;
  /** Verify the SMS code and create/read the profile for the chosen role. */
  verifyOtp: (code: string, name: string, role: Role) => Promise<UserProfile>;
  /** Sign in (or sign up on first use) with email + password. */
  signInWithEmail: (
    email: string,
    password: string,
    opts: { name: string; role: Role; mode: "signin" | "signup" },
  ) => Promise<UserProfile>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthStore | null>(null);

// Store the verifier on window so we follow Firebase's documented pattern and
// avoid duplicate widgets across re-renders.
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

function resetRecaptcha() {
  if (typeof window === "undefined") return;
  try {
    window.recaptchaVerifier?.clear();
  } catch {
    // ignore
  }
  window.recaptchaVerifier = undefined;
  const el = document.getElementById("recaptcha-container");
  if (el) el.innerHTML = "";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const snap = await getDoc(doc(getDb(), "users", fbUser.uid));
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const sendOtp = useCallback(async (phoneE164: string) => {
    const auth = getFirebaseAuth();
    // Use device language for reCAPTCHA / SMS text.
    auth.useDeviceLanguage();

    // Rebuild verifier every time — avoids "reCAPTCHA already rendered" and
    // stale token issues when a first attempt failed.
    resetRecaptcha();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    await window.recaptchaVerifier.render();

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneE164,
        window.recaptchaVerifier,
      );
      confirmationRef.current = confirmation;
      window.confirmationResult = confirmation;
    } catch (err) {
      // On failure the widget is single-use — wipe so the next attempt is clean.
      resetRecaptcha();
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/billing-not-enabled" || code === "auth/quota-exceeded") {
        throw new Error(
          "Phone sign-in isn't enabled on your Firebase project (needs Blaze plan or quota). Use Email sign-in instead.",
        );
      }
      if (code === "auth/invalid-phone-number") {
        throw new Error("That phone number isn't valid. Include the country code (e.g. +2567…).");
      }
      if (code === "auth/too-many-requests") {
        throw new Error("Too many attempts from this device. Try again later or use email sign-in.");
      }
      throw new Error(
        (err as Error)?.message ??
          "Couldn't send the code. Check your Firebase Phone auth settings and try again.",
      );
    }
  }, []);

  const upsertProfile = useCallback(
    async (uid: string, next: Omit<UserProfile, "uid">, allowAdmin: boolean) => {
      const ref = doc(getDb(), "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const existing = snap.data() as UserProfile;
        if (next.role === "admin" && existing.role !== "admin") {
          await signOut(getFirebaseAuth());
          throw new Error("This account isn't authorised for the Admin console.");
        }
        return existing;
      }
      if (next.role === "admin" && !allowAdmin) {
        await signOut(getFirebaseAuth());
        throw new Error("Admin accounts must be granted from the Firebase console.");
      }
      const created: UserProfile = { uid, ...next };
      await setDoc(ref, { ...created, createdAt: serverTimestamp() });
      return created;
    },
    [],
  );

  const verifyOtp = useCallback(
    async (code: string, name: string, role: Role): Promise<UserProfile> => {
      if (!confirmationRef.current) {
        throw new Error("Request a code before verifying.");
      }
      const cred = await confirmationRef.current.confirm(code);
      const resolved = await upsertProfile(
        cred.user.uid,
        {
          name: name.trim() || "Driver",
          phone: cred.user.phoneNumber ?? "",
          role,
        },
        false,
      );
      setProfile(resolved);
      resetRecaptcha();
      return resolved;
    },
    [upsertProfile],
  );

  const signInWithEmail = useCallback<AuthStore["signInWithEmail"]>(
    async (email, password, { name, role, mode }) => {
      const auth = getFirebaseAuth();
      const cred =
        mode === "signup"
          ? await createUserWithEmailAndPassword(auth, email, password)
          : await signInWithEmailAndPassword(auth, email, password);
      const resolved = await upsertProfile(
        cred.user.uid,
        {
          name: name.trim() || cred.user.email?.split("@")[0] || "User",
          phone: cred.user.phoneNumber ?? "",
          email: cred.user.email ?? email,
          role,
        },
        false,
      );
      setProfile(resolved);
      return resolved;
    },
    [upsertProfile],
  );

  const signOutUser = useCallback(async () => {
    if (isFirebaseConfigured) await signOut(getFirebaseAuth());
    setProfile(null);
    resetRecaptcha();
  }, []);

  const value = useMemo<AuthStore>(
    () => ({
      configured: isFirebaseConfigured,
      loading,
      user,
      profile,
      sendOtp,
      verifyOtp,
      signInWithEmail,
      signOutUser,
    }),
    [loading, user, profile, sendOtp, verifyOtp, signInWithEmail, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthStore {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
