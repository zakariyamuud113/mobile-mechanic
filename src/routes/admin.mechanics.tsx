import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Star, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mechanics as seed } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/mechanics")({
  component: AdminMechanics,
});

function AdminMechanics() {
  const [items, setItems] = useState(seed);

  const setStatus = (id: string, status: "approved" | "suspended") =>
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Mechanic verification</h2>
        <p className="text-sm text-muted-foreground">
          Review documents and approve or reject registrations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {m.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.specialty}</p>
                </div>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                  m.status === "approved" && "bg-success/15 text-success",
                  m.status === "pending" && "bg-warning/15 text-warning",
                  m.status === "suspended" && "bg-destructive/15 text-destructive",
                )}
              >
                {m.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" /> {m.rating} rating
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Phone className="h-4 w-4" /> {m.phone}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {["National ID", "Driving permit", "Certification"].map((d) => (
                <span key={d} className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3" /> {d}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={m.status === "suspended"}
                onClick={() => setStatus(m.id, "suspended")}
              >
                <X className="h-4 w-4" /> {m.status === "approved" ? "Suspend" : "Reject"}
              </Button>
              <Button
                size="sm"
                disabled={m.status === "approved"}
                onClick={() => setStatus(m.id, "approved")}
              >
                <Check className="h-4 w-4" /> Approve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
