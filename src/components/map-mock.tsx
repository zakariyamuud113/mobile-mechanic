import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

/** Stylized map placeholder (no real map SDK in prototype). */
export function MapMock({
  className,
  label = "Your location",
  showRoute = false,
}: {
  className?: string;
  label?: string;
  showRoute?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface",
        className,
      )}
    >
      <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="oklch(0.35 0.02 262)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <path d="M -10 60 Q 120 40 200 120 T 420 140" fill="none" stroke="oklch(0.4 0.03 262)" strokeWidth="6" />
        <path d="M 40 -10 L 90 220" fill="none" stroke="oklch(0.4 0.03 262)" strokeWidth="6" />
        {showRoute && (
          <path
            d="M 60 180 Q 160 150 210 90 T 330 50"
            fill="none"
            stroke="oklch(0.62 0.19 258)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
        )}
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex items-center justify-center">
          <span className="absolute h-10 w-10 animate-ping rounded-full bg-primary/30" />
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <MapPin className="h-4 w-4" />
          </span>
        </div>
      </div>
      {showRoute && (
        <span className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground">
          <Navigation className="h-4 w-4" />
        </span>
      )}
      <div className="absolute bottom-3 left-3 rounded-lg bg-background/70 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
        {label}
      </div>
    </div>
  );
}
