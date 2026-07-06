import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { history, ugx } from "@/lib/mock-data";

export const Route = createFileRoute("/customer/history")({
  component: CustomerHistory,
});

function CustomerHistory() {
  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-2xl font-bold">Activity</h1>

      <div className="space-y-3">
        {history.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{r.service}</p>
                <p className="text-xs text-muted-foreground">
                  {r.vehicle} · {r.location}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{r.date}</span>
              <span className="font-medium">
                {r.price > 0 ? ugx(r.price) : "—"}
              </span>
            </div>
            {r.mechanic && (
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-muted-foreground">{r.mechanic}</span>
                {r.rating && (
                  <span className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-warning text-warning" />
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
