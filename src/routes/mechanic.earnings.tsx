import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ugx } from "@/lib/mock-data";

export const Route = createFileRoute("/mechanic/earnings")({
  component: MechanicEarnings,
});

const weekly = [
  { day: "Mon", amount: 65000 },
  { day: "Tue", amount: 90000 },
  { day: "Wed", amount: 40000 },
  { day: "Thu", amount: 120000 },
  { day: "Fri", amount: 85000 },
  { day: "Sat", amount: 150000 },
  { day: "Sun", amount: 70000 },
];

const payouts = [
  { id: "p1", label: "Battery Jump Start", date: "Today · 14:20", amount: 40000 },
  { id: "p2", label: "Won't Start Diagnosis", date: "Today · 11:05", amount: 45000 },
  { id: "p3", label: "Flat Tire Assistance", date: "Yesterday · 16:40", amount: 45000 },
];

function MechanicEarnings() {
  const max = Math.max(...weekly.map((w) => w.amount));
  const total = weekly.reduce((s, w) => s + w.amount, 0);

  return (
    <div className="space-y-6 pt-2">
      <h1 className="text-2xl font-bold">Earnings</h1>

      <div className="rounded-2xl border border-border bg-gradient-primary p-5 text-primary-foreground shadow-glow">
        <div className="flex items-center gap-2 text-sm opacity-90">
          <Wallet className="h-4 w-4" /> This week
        </div>
        <p className="mt-2 text-3xl font-bold">{ugx(total)}</p>
        <p className="mt-1 flex items-center gap-1 text-sm opacity-90">
          <TrendingUp className="h-4 w-4" /> +18% vs last week
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Daily breakdown</h2>
        <div className="flex items-end justify-between gap-2" style={{ height: 140 }}>
          {weekly.map((w) => (
            <div key={w.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-primary/70"
                style={{ height: `${(w.amount / max) * 110}px` }}
              />
              <span className="text-xs text-muted-foreground">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Recent payouts</h2>
        <div className="space-y-2">
          {payouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3.5">
              <div>
                <p className="font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.date}</p>
              </div>
              <span className="font-semibold text-success">+{ugx(p.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      <Button variant="secondary" className="w-full">
        Withdraw to Mobile Money
      </Button>
    </div>
  );
}
