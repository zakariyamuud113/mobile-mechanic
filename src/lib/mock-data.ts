import {
  Wrench,
  BatteryCharging,
  Disc3,
  Fuel,
  Truck,
  CircleAlert,
  type LucideIcon,
} from "lucide-react";

export type ServiceId =
  | "mobile-mechanic"
  | "battery"
  | "flat-tire"
  | "fuel"
  | "towing"
  | "diagnosis";

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  eta: string;
  basePrice: number; // UGX
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    id: "mobile-mechanic",
    name: "Mobile Mechanic",
    description: "On-site repairs by a verified pro at your location.",
    eta: "20–35 min",
    basePrice: 60000,
    icon: Wrench,
  },
  {
    id: "battery",
    name: "Battery Jump Start",
    description: "Dead battery? Get a jump start and be on your way.",
    eta: "15–25 min",
    basePrice: 40000,
    icon: BatteryCharging,
  },
  {
    id: "flat-tire",
    name: "Flat Tire Assistance",
    description: "Tire change or on-spot repair, wherever you are.",
    eta: "20–30 min",
    basePrice: 45000,
    icon: Disc3,
  },
  {
    id: "fuel",
    name: "Fuel Delivery",
    description: "Ran out of fuel? We bring enough to reach a station.",
    eta: "20–30 min",
    basePrice: 35000,
    icon: Fuel,
  },
  {
    id: "towing",
    name: "Towing",
    description: "Safe towing to your preferred garage or destination.",
    eta: "30–50 min",
    basePrice: 90000,
    icon: Truck,
  },
  {
    id: "diagnosis",
    name: "Won't Start Diagnosis",
    description: "Expert diagnosis when your car refuses to start.",
    eta: "25–40 min",
    basePrice: 50000,
    icon: CircleAlert,
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  color: string;
  year: number;
}

export const vehicles: Vehicle[] = [
  { id: "v1", name: "Toyota Premio", plate: "UBK 482H", color: "Silver", year: 2015 },
  { id: "v2", name: "Nissan X-Trail", plate: "UAX 019J", color: "White", year: 2018 },
  { id: "v3", name: "Toyota Hiace", plate: "UBH 771C", color: "White", year: 2013 },
];

export interface Mechanic {
  id: string;
  name: string;
  rating: number;
  jobs: number;
  distanceKm: number;
  specialty: string;
  status: "pending" | "approved" | "suspended";
  phone: string;
}

export const mechanics: Mechanic[] = [
  { id: "m1", name: "David Okello", rating: 4.9, jobs: 312, distanceKm: 1.8, specialty: "Engine & Diagnostics", status: "approved", phone: "+256 772 000 111" },
  { id: "m2", name: "Sarah Nabirye", rating: 4.8, jobs: 208, distanceKm: 2.4, specialty: "Tires & Brakes", status: "approved", phone: "+256 701 222 333" },
  { id: "m3", name: "Ibrahim Ssali", rating: 4.7, jobs: 156, distanceKm: 3.1, specialty: "Electrical & Battery", status: "pending", phone: "+256 753 444 555" },
  { id: "m4", name: "Grace Atim", rating: 4.6, jobs: 89, distanceKm: 4.0, specialty: "Towing", status: "pending", phone: "+256 774 666 777" },
];

export type JobStatus =
  | "requested"
  | "accepted"
  | "en-route"
  | "arrived"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface LatLng {
  lat: number;
  lng: number;
}

/** Central Kampala reference point. */
export const KAMPALA: LatLng = { lat: 0.3476, lng: 32.5825 };

/** Approximate coordinates for the neighbourhoods used across the app. */
export const areaCoords: Record<string, LatLng> = {
  Kololo: { lat: 0.335, lng: 32.59 },
  Bugolobi: { lat: 0.33, lng: 32.615 },
  Naguru: { lat: 0.345, lng: 32.605 },
  Ntinda: { lat: 0.36, lng: 32.61 },
  Entebbe: { lat: 0.32, lng: 32.57 },
};

/** Resolve a free-text location to a coordinate (falls back to city centre). */
export function coordForLocation(location: string): LatLng {
  const match = Object.keys(areaCoords).find((area) => location.includes(area));
  return match ? areaCoords[match] : KAMPALA;
}

/** A nearby mechanic starting point offset from the customer. */
export function nearbyCoord(base: LatLng, offset = 0.02): LatLng {
  return { lat: base.lat + offset, lng: base.lng - offset };
}

export interface ServiceRequest {
  id: string;
  service: string;
  vehicle: string;
  customer: string;
  location: string;
  status: JobStatus;
  price: number;
  date: string;
  rating?: number;
  mechanic?: string;
  coord?: LatLng;
  mechanicCoord?: LatLng;
}

export const history: ServiceRequest[] = [
  { id: "r1041", service: "Battery Jump Start", vehicle: "Toyota Premio", customer: "You", location: "Kololo, Kampala", status: "completed", price: 40000, date: "12 Jun 2026", rating: 5, mechanic: "David Okello" },
  { id: "r0987", service: "Flat Tire Assistance", vehicle: "Nissan X-Trail", customer: "You", location: "Ntinda, Kampala", status: "completed", price: 45000, date: "28 May 2026", rating: 4, mechanic: "Sarah Nabirye" },
  { id: "r0902", service: "Fuel Delivery", vehicle: "Toyota Premio", customer: "You", location: "Entebbe Rd", status: "cancelled", price: 0, date: "14 May 2026" },
];

export const incomingJobs: ServiceRequest[] = [
  { id: "r1102", service: "Battery Jump Start", vehicle: "Toyota Corolla", customer: "James M.", location: "Bugolobi — 1.9 km away", status: "requested", price: 40000, date: "Now", coord: areaCoords.Bugolobi, mechanicCoord: nearbyCoord(areaCoords.Bugolobi) },
  { id: "r1103", service: "Won't Start Diagnosis", vehicle: "Subaru Forester", customer: "Aisha K.", location: "Naguru — 3.2 km away", status: "requested", price: 50000, date: "Now", coord: areaCoords.Naguru, mechanicCoord: nearbyCoord(areaCoords.Naguru) },
];


export const statusLabels: Record<JobStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "en-route": "En route",
  arrived: "Arrived",
  "in-progress": "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function ugx(amount: number): string {
  return "UGX " + amount.toLocaleString("en-UG");
}
