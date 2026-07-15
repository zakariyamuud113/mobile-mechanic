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
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import { useAuth, type Role } from "./auth-store";
import {
  history as seedHistory,
  incomingJobs as seedIncoming,
  areaCoords,
  coordForLocation,
  nearbyCoord,
  type JobStatus,
  type LatLng,
  type ServiceRequest,
} from "./mock-data";

export type { Role } from "./auth-store";

export interface CurrentUser {
  name: string;
  phone: string;
  role: Role;
}

// Demo jobs seeded once into Firestore so boards aren't empty on first run.
const seedLiveJobs: ServiceRequest[] = [
  { id: "r1104", service: "Towing", vehicle: "Toyota Harrier", customer: "Peter O.", location: "Ntinda — 2.7 km away", status: "accepted", price: 90000, date: "Now", mechanic: "Ibrahim Ssali", coord: areaCoords.Ntinda, mechanicCoord: nearbyCoord(areaCoords.Ntinda) },
  { id: "r1105", service: "Fuel Delivery", vehicle: "Mazda Demio", customer: "Ritah N.", location: "Kololo — 1.2 km away", status: "arrived", price: 35000, date: "Now", mechanic: "Grace Atim", coord: areaCoords.Kololo, mechanicCoord: nearbyCoord(areaCoords.Kololo, 0.005) },
];

interface JobStore {
  currentUser: CurrentUser | null;
  jobs: ServiceRequest[];
  createJob: (input: {
    service: string;
    vehicle: string;
    location: string;
    price: number;
  }) => ServiceRequest;
  acceptJob: (id: string, mechanic: string, mechanicPhone?: string) => void;
  /** Admin-initiated dispatch: assign a mechanic without their acceptance. */
  dispatchJob: (id: string, mechanicName: string, mechanicPhone?: string) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  updateMechanicCoord: (id: string, coord: LatLng) => void;
  rateJob: (id: string, rating: number) => void;
  getJob: (id: string) => ServiceRequest | undefined;
}

const JobContext = createContext<JobStore | null>(null);

/** Firestore rejects undefined values — strip them before writing. */
function clean<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as T;
}

export function JobProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState<ServiceRequest[]>([]);
  const seededRef = useRef(false);

  const currentUser = useMemo<CurrentUser | null>(
    () => (profile ? { name: profile.name, phone: profile.phone, role: profile.role } : null),
    [profile],
  );

  // Live subscription to all jobs, ordered newest-first.
  useEffect(() => {
    if (!isFirebaseConfigured || !user) return;
    const db = getDb();
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const next = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ServiceRequest, "id">) }));
      setJobs(next);

      // Seed demo data once if the collection is empty.
      if (snap.empty && !seededRef.current) {
        seededRef.current = true;
        void seedDemoJobs();
      }
    });
    return () => unsub();
  }, [user]);

  const seedDemoJobs = useCallback(async () => {
    const db = getDb();
    const existing = await getDocs(collection(db, "jobs"));
    if (!existing.empty) return;
    const all = [...seedIncoming, ...seedLiveJobs, ...seedHistory];
    await Promise.all(
      all.map((j, i) =>
        setDoc(
          doc(db, "jobs", j.id),
          clean({ ...j, createdAt: serverTimestamp(), order: i } as Record<string, unknown>),
        ),
      ),
    );
  }, []);

  const createJob = useCallback<JobStore["createJob"]>(
    (input) => {
      const db = getDb();
      const ref = doc(collection(db, "jobs"));
      const coord = coordForLocation(input.location);
      const job: ServiceRequest = {
        id: ref.id,
        service: input.service,
        vehicle: input.vehicle,
        customer: profile?.name ?? "You",
        location: input.location,
        status: "requested",
        price: input.price,
        date: "Now",
        coord,
        mechanicCoord: nearbyCoord(coord),
      };
      void setDoc(
        ref,
        clean({
          ...job,
          customerUid: user?.uid ?? null,
          customerPhone: profile?.phone ?? null,
          createdAt: serverTimestamp(),
        } as Record<string, unknown>),
      );
      return job;
    },
    [profile, user],
  );

  const acceptJob = useCallback(
    (id: string, mechanic: string, mechanicPhone?: string) => {
      void updateDoc(
        doc(getDb(), "jobs", id),
        clean({
          status: "accepted",
          mechanic,
          mechanicUid: user?.uid ?? null,
          mechanicPhone: mechanicPhone ?? profile?.phone ?? null,
        }),
      );
    },
    [user, profile],
  );

  const dispatchJob = useCallback(
    (id: string, mechanicName: string, mechanicPhone?: string) => {
      void updateDoc(
        doc(getDb(), "jobs", id),
        clean({
          status: "accepted",
          mechanic: mechanicName,
          mechanicPhone: mechanicPhone ?? null,
          dispatchedBy: user?.uid ?? null,
        }),
      );
    },
    [user],
  );

  const updateJobStatus = useCallback((id: string, status: JobStatus) => {
    void updateDoc(doc(getDb(), "jobs", id), { status });
  }, []);

  const updateMechanicCoord = useCallback((id: string, coord: LatLng) => {
    void updateDoc(doc(getDb(), "jobs", id), { mechanicCoord: coord });
  }, []);

  const rateJob = useCallback((id: string, rating: number) => {
    void updateDoc(doc(getDb(), "jobs", id), { rating });
  }, []);

  const getJob = useCallback((id: string) => jobs.find((j) => j.id === id), [jobs]);

  const value = useMemo<JobStore>(
    () => ({
      currentUser,
      jobs,
      createJob,
      acceptJob,
      dispatchJob,
      updateJobStatus,
      updateMechanicCoord,
      rateJob,
      getJob,
    }),
    [currentUser, jobs, createJob, acceptJob, dispatchJob, updateJobStatus, updateMechanicCoord, rateJob, getJob],
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobStore(): JobStore {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobStore must be used within JobProvider");
  return ctx;
}
