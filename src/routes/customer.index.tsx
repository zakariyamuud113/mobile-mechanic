import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight, Clock } from "lucide-react";
import { MapMock } from "@/components/map-mock";
import { services, vehicles, ugx } from "@/lib/mock-data";
import { useJobStore } from "@/lib/job-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customer/")({
  component: CustomerHome,
});

function CustomerHome() {
  const [selected, setSelected] = useState(vehicles[0].id);
  const { currentUser } = useJobStore();
  const firstName = (currentUser?.name ?? "there").split(" ")[0];
  const selectedVehicle = vehicles.find((v) => v.id === selected) ?? vehicles[0];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-sm text-muted-foreground">Hi {firstName},</p>
        <h1 className="text-2xl font-bold">Where do you need help?</h1>
      </div>


      <MapMock className="h-40" label="Kololo, Kampala · GPS locked" />

      {/* Vehicle picker */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Your vehicle</h2>
          <Link to="/customer/profile" className="text-xs font-medium text-primary">
            Manage
          </Link>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {vehicles.map((v) => {
            const active = v.id === selected;
            return (
              <button
                key={v.id}
                onClick={() => setSelected(v.id)}
                className={cn(
                  "min-w-[150px] rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{v.name}</span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{v.plate} · {v.color}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services */}
      <div>
        <h2 className="mb-2 text-sm font-semibold">Choose a service</h2>
        <div className="space-y-2.5">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/customer/request/$service"
              params={{ service: s.id }}
              search={{ vehicle: selectedVehicle.name }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.eta} · from {ugx(s.basePrice)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
