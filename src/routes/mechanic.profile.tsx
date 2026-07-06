import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileText, Star, Wrench, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mechanic/profile")({
  component: MechanicProfile,
});

function MechanicProfile() {
  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary">
          DO
        </span>
        <div>
          <h1 className="flex items-center gap-1.5 text-xl font-bold">
            David Okello <BadgeCheck className="h-5 w-5 text-primary" />
          </h1>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" /> 4.9 · 312 jobs
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-success/40 bg-success/10 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-success">
          <BadgeCheck className="h-4 w-4" /> Verified professional
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Identity and certifications approved by RoadReady.
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {["Engine & Diagnostics", "Electrical", "Battery", "Brakes"].map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium">
              <Wrench className="h-3 w-3 text-primary" /> {s}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: FileText, label: "Documents & certifications" },
          { icon: BadgeCheck, label: "Verification status" },
        ].map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3.5 text-left"
          >
            <item.icon className="h-5 w-5 text-primary" />
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      <Button variant="secondary" className="w-full">
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}
