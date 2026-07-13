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
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

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
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    confirmationRef.current = await signInWithPhoneNumber(
      auth,
      phoneE164,
      recaptchaRef.current,
    );
  }, []);

  const verifyOtp = useCallback(
    async (code: string, name: string, role: Role): Promise<UserProfile> => {
      if (!confirmationRef.current) {
        throw new Error("Request a code before verifying.");
      }
      const cred = await confirmationRef.current.confirm(code);
      const uid = cred.user.uid;
      const ref = doc(getDb(), "users", uid);
      const snap = await getDoc(ref);

      let resolved: UserProfile;
      if (snap.exists()) {
        // Returning user — trust the stored role (admin is granted server-side/console).
        resolved = snap.data() as UserProfile;
        if (role === "admin" && resolved.role !== "admin") {
          await signOut(getFirebaseAuth());
          throw new Error("This number is not authorised for the Admin console.");
        }
      } else {
        // New user — never allow self-service admin.
        if (role === "admin") {
          await signOut(getFirebaseAuth());
          throw new Error("This number is not authorised for the Admin console.");
        }
        resolved = {
          uid,
          name: name.trim() || "Driver",
          phone: cred.user.phoneNumber ?? "",
          role,
        };
        await setDoc(ref, { ...resolved, createdAt: serverTimestamp() });
      }
      setProfile(resolved);
      return resolved;
    },
    [],
  );

  const signOutUser = useCallback(async () => {
    if (isFirebaseConfigured) await signOut(getFirebaseAuth());
    setProfile(null);
  }, []);

  const value = useMemo<AuthStore>(
    () => ({
      configured: isFirebaseConfigured,
      loading,
      user,
      profile,
      sendOtp,
      verifyOtp,
      signOutUser,
    }),
    [loading, user, profile, sendOtp, verifyOtp, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthStore {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
