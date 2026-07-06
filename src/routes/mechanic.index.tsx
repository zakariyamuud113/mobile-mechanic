import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Check, X, Navigation, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapMock } from "@/components/map-mock";
import { incomingJobs, ugx, type ServiceRequest } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mechanic/")({
  component: MechanicJobs,
});

function MechanicJobs() {
  const [online, setOnline] = useState(true);
  const [accepted, setAccepted] = useState<ServiceRequest | null>(null);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const jobs = incomingJobs.filter((j) => !dismissed.includes(j.id));

  return (
    <div className="space-y-5 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Hi David,</p>
          <h1 className="text-2xl font-bold">{online ? "You're online" : "You're offline"}</h1>
        </div>
        <button
          onClick={() => setOnline((o) => !o)}
          className={cn(
            "relative h-8 w-14 rounded-full transition-colors",
            online ? "bg-success" : "bg-secondary",
          )}
          aria-label="Toggle availability"
        >
          <span
            className={cn(
              "absolute top-1 h-6 w-6 rounded-full bg-background transition-all",
              online ? "left-7" : "left-1",
            )}
          />
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today", value: ugx(85000) },
          { label: "Jobs", value: "3" },
          { label: "Rating", value: "4.9★" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-base font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {accepted ? (
        <div className="space-y-4">
          <MapMock className="h-40" label={`Navigate to ${accepted.customer}`} showRoute />
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{accepted.service}</p>
              <span className="font-medium">{ugx(accepted.price)}</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {accepted.location}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {accepted.customer} · {accepted.vehicle}
            </p>
            <Button className="mt-4 w-full">
              <Navigation className="h-4 w-4" /> Start navigation
            </Button>
            <Button variant="secondary" className="mt-2 w-full" onClick={() => setAccepted(null)}>
              Complete job
            </Button>
          </div>
        </div>
      ) : !online ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Go online to start receiving nearby job requests.
        </div>
      ) : (
        <div>
          <h2 className="mb-2 text-sm font-semibold">Nearby requests</h2>
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No new requests right now. We'll notify you.
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{job.service}</p>
                    <span className="font-medium text-primary">{ugx(job.price)}</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{job.customer} · {job.vehicle}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> just now
                    </span>
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setDismissed((d) => [...d, job.id])}>
                      <X className="h-4 w-4" /> Decline
                    </Button>
                    <Button size="sm" onClick={() => setAccepted(job)}>
                      <Check className="h-4 w-4" /> Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
        <Star className="h-4 w-4 text-warning" />
        Higher acceptance rates unlock priority job matching.
      </div>
    </div>
  );
}
