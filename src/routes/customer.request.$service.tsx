import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  MapPin,
  Phone,
  MessageCircle,
  Star,
  Loader2,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapMock } from "@/components/map-mock";
import { StatusBadge } from "@/components/status-badge";
import { getService, mechanics, ugx, type JobStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customer/request/$service")({
  component: RequestFlow,
});

type Step = "confirm" | "searching" | "tracking" | "rate";

const trackStages: { status: JobStatus; label: string }[] = [
  { status: "accepted", label: "Mechanic accepted your request" },
  { status: "en-route", label: "On the way to your location" },
  { status: "arrived", label: "Arrived at your location" },
  { status: "in-progress", label: "Working on your vehicle" },
  { status: "completed", label: "Service completed" },
];

function RequestFlow() {
  const { service: serviceId } = Route.useParams();
  const navigate = useNavigate();
  const service = getService(serviceId);
  const mechanic = mechanics[0];

  const [step, setStep] = useState<Step>("confirm");
  const [stage, setStage] = useState(0);
  const [rating, setRating] = useState(0);

  if (!service) {
    return (
      <div className="pt-10 text-center">
        <p className="text-muted-foreground">Service not found.</p>
        <Button className="mt-4" onClick={() => navigate({ to: "/customer" })}>
          Back home
        </Button>
      </div>
    );
  }

  const startSearch = () => {
    setStep("searching");
    setTimeout(() => setStep("tracking"), 2200);
  };

  const advance = () => {
    if (stage < trackStages.length - 1) {
      setStage((s) => s + 1);
    } else {
      setStep("rate");
    }
  };

  return (
    <div className="space-y-5 pt-2">
      <button
        onClick={() => navigate({ to: "/customer" })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </button>

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
          <service.icon className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-xl font-bold">{service.name}</h1>
          <p className="text-sm text-muted-foreground">ETA {service.eta}</p>
        </div>
      </div>

      {step === "confirm" && (
        <>
          <MapMock className="h-44" label="Kololo, Kampala · Auto-detected" />
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Plot 12, Acacia Ave, Kololo</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Location shared automatically. Tap to adjust.
            </p>
          </div>

          <button className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-card p-4 text-left text-sm text-muted-foreground hover:border-primary/40">
            <Camera className="h-5 w-5 text-primary" />
            Add photos of the problem (optional)
          </button>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base price</span>
              <span className="font-medium">{ugx(service.basePrice)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium">MTN / Airtel Money</span>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={startSearch}>
            Confirm request
          </Button>
        </>
      )}

      {step === "searching" && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute h-20 w-20 animate-ping rounded-full bg-primary/20" />
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Finding your nearest pro…</h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Matching you with the closest verified mechanic for {service.name}.
          </p>
        </div>
      )}

      {step === "tracking" && (
        <>
          <MapMock className="h-44" label={`${mechanic.name} · ${mechanic.distanceKm} km away`} showRoute />

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {mechanic.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div>
                  <p className="font-semibold">{mechanic.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" /> {mechanic.rating} · {mechanic.jobs} jobs
                  </p>
                </div>
              </div>
              <StatusBadge status={trackStages[stage].status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm">
                <Phone className="h-4 w-4" /> Call
              </Button>
              <Button variant="secondary" size="sm">
                <MessageCircle className="h-4 w-4" /> Chat
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Live status</h3>
            <ol className="space-y-3">
              {trackStages.map((t, i) => (
                <li key={t.status} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      i <= stage
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {i < stage ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={cn("text-sm", i <= stage ? "text-foreground" : "text-muted-foreground")}>
                    {t.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <Button size="lg" className="w-full" onClick={advance}>
            {stage < trackStages.length - 1 ? "Simulate next update" : "Pay & finish"}
          </Button>
        </>
      )}

      {step === "rate" && (
        <div className="space-y-5 py-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="h-14 w-14 text-success" />
            <h2 className="text-xl font-bold">Service completed</h2>
            <p className="text-sm text-muted-foreground">
              {ugx(service.basePrice)} paid via Mobile Money.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="text-sm font-medium">How was {mechanic.name}?</p>
            <div className="mt-3 flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      n <= rating ? "fill-warning text-warning" : "text-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={() => navigate({ to: "/customer/history" })}>
            Submit & view activity
          </Button>
        </div>
      )}
    </div>
  );
}
