import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  history as seedHistory,
  incomingJobs as seedIncoming,
  areaCoords,
  coordForLocation,
  nearbyCoord,
  type JobStatus,
  type ServiceRequest,
} from "./mock-data";

export type Role = "customer" | "mechanic" | "admin";

export interface CurrentUser {
  name: string;
  phone: string;
  role: Role;
}

const roleNames: Record<Role, string> = {
  customer: "Brian",
  mechanic: "David Okello",
  admin: "Admin",
};

// Extra live jobs so the admin board and mechanic feed feel populated from the start.
const seedLiveJobs: ServiceRequest[] = [
  { id: "r1104", service: "Towing", vehicle: "Toyota Harrier", customer: "Peter O.", location: "Ntinda — 2.7 km away", status: "accepted", price: 90000, date: "Now", mechanic: "Ibrahim Ssali" },
  { id: "r1105", service: "Fuel Delivery", vehicle: "Mazda Demio", customer: "Ritah N.", location: "Kololo — 1.2 km away", status: "arrived", price: 35000, date: "Now", mechanic: "Grace Atim" },
];

interface JobStore {
  currentUser: CurrentUser | null;
  jobs: ServiceRequest[];
  signIn: (role: Role, phone: string, name?: string) => void;
  signOut: () => void;
  createJob: (input: {
    service: string;
    vehicle: string;
    location: string;
    price: number;
  }) => ServiceRequest;
  acceptJob: (id: string, mechanic: string) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  rateJob: (id: string, rating: number) => void;
  getJob: (id: string) => ServiceRequest | undefined;
}

const JobContext = createContext<JobStore | null>(null);

export function JobProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [jobs, setJobs] = useState<ServiceRequest[]>([
    ...seedIncoming,
    ...seedLiveJobs,
    ...seedHistory,
  ]);

  const signIn = useCallback((role: Role, phone: string, name?: string) => {
    setCurrentUser({ role, phone, name: name?.trim() || roleNames[role] });
  }, []);

  const signOut = useCallback(() => setCurrentUser(null), []);

  const createJob = useCallback<JobStore["createJob"]>((input) => {
    const job: ServiceRequest = {
      id: "r" + Math.floor(1000 + Math.random() * 9000),
      service: input.service,
      vehicle: input.vehicle,
      customer: "You",
      location: input.location,
      status: "requested",
      price: input.price,
      date: "Now",
    };
    setJobs((prev) => [job, ...prev]);
    return job;
  }, []);

  const acceptJob = useCallback((id: string, mechanic: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "accepted", mechanic } : j)),
    );
  }, []);

  const updateJobStatus = useCallback((id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  }, []);

  const rateJob = useCallback((id: string, rating: number) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, rating } : j)));
  }, []);

  const getJob = useCallback(
    (id: string) => jobs.find((j) => j.id === id),
    [jobs],
  );

  const value = useMemo<JobStore>(
    () => ({
      currentUser,
      jobs,
      signIn,
      signOut,
      createJob,
      acceptJob,
      updateJobStatus,
      rateJob,
      getJob,
    }),
    [currentUser, jobs, signIn, signOut, createJob, acceptJob, updateJobStatus, rateJob, getJob],
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobStore(): JobStore {
  const ctx = useContext(JobContext);
  if (!ctx) throw new Error("useJobStore must be used within JobProvider");
  return ctx;
}
