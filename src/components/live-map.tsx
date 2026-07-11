/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { loadGoogleMaps } from "@/lib/maps-loader";
import { cn } from "@/lib/utils";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LiveMapProps {
  className?: string;
  label?: string;
  /** Customer / destination position. */
  customer: LatLng;
  /** Mechanic position. When `moving` is true it animates toward the customer. */
  mechanic?: LatLng;
  /** Animate the mechanic marker gradually toward the customer (live tracking). */
  moving?: boolean;
}

// Sleek-dark map styling to match the app theme.
const darkStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1b2130" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1b2130" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a94a6" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a3346" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a3b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#141a26" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

export function LiveMap({ className, label, customer, mechanic, moving }: LiveMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const customerMarker = useRef<google.maps.Marker | null>(null);
  const mechanicMarker = useRef<google.maps.Marker | null>(null);
  const routeLine = useRef<google.maps.Polyline | null>(null);
  const [error, setError] = useState(false);

  // Init map once.
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !ref.current) return;
        const map = new g.maps.Map(ref.current, {
          center: customer,
          zoom: 14,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          styles: darkStyle,
        });
        mapRef.current = map;
        customerMarker.current = new g.maps.Marker({
          position: customer,
          map,
          icon: {
            path: g.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#3b82f6",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: "Your location",
        });
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep customer position in sync.
  useEffect(() => {
    customerMarker.current?.setPosition(customer);
    mapRef.current?.setCenter(customer);
  }, [customer.lat, customer.lng]);

  // Mechanic marker + route + live movement.
  useEffect(() => {
    const g = window.google;
    const map = mapRef.current;
    if (!g || !map) return;

    if (!mechanic) {
      mechanicMarker.current?.setMap(null);
      routeLine.current?.setMap(null);
      return;
    }

    if (!mechanicMarker.current) {
      mechanicMarker.current = new g.maps.Marker({
        map,
        icon: {
          path: "M -2,-2 2,-2 2,2 -2,2 z",
          scale: 4,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          rotation: 0,
        },
        title: "Mechanic",
      });
    }
    if (!routeLine.current) {
      routeLine.current = new g.maps.Polyline({
        map,
        geodesic: true,
        strokeColor: "#3b82f6",
        strokeOpacity: 0.7,
        strokeWeight: 3,
      });
    }

    let pos = { ...mechanic };
    let raf = 0;

    const draw = () => {
      mechanicMarker.current?.setPosition(pos);
      routeLine.current?.setPath([pos, customer]);
      const bounds = new g.maps.LatLngBounds();
      bounds.extend(pos);
      bounds.extend(customer);
      map.fitBounds(bounds, 64);
    };

    draw();

    if (moving) {
      const step = () => {
        pos = {
          lat: pos.lat + (customer.lat - pos.lat) * 0.02,
          lng: pos.lng + (customer.lng - pos.lng) * 0.02,
        };
        mechanicMarker.current?.setPosition(pos);
        routeLine.current?.setPath([pos, customer]);
        const dist = Math.hypot(customer.lat - pos.lat, customer.lng - pos.lng);
        if (dist > 0.0002) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    return () => cancelAnimationFrame(raf);
  }, [mechanic?.lat, mechanic?.lng, customer.lat, customer.lng, moving]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-surface", className)}>
      <div ref={ref} className="h-full w-full" />
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-5 w-5" />
          Map unavailable
        </div>
      )}
      {label && (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-background/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
          {label}
        </div>
      )}
    </div>
  );
}
