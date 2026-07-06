import { createFileRoute } from "@tanstack/react-router";
import { Car, Plus, Bell, ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/lib/mock-data";

export const Route = createFileRoute("/customer/profile")({
  component: CustomerProfile,
});

function CustomerProfile() {
  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-semibold text-primary">
          AN
        </span>
        <div>
          <h1 className="text-xl font-bold">Aaron Namuli</h1>
          <p className="text-sm text-muted-foreground">+256 772 123 456</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">My vehicles</h2>
          <Button variant="ghost" size="sm" className="h-7 text-primary">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {vehicles.map((v) => (
            <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                <Car className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">{v.name}</p>
                <p className="text-xs text-muted-foreground">{v.plate} · {v.color} · {v.year}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: Bell, label: "Notifications" },
          { icon: ShieldCheck, label: "Privacy & security" },
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
