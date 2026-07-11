import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Wrench,
  Activity,
  Banknote,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ugx } from "@/lib/mock-data";
import { useJobStore } from "@/lib/job-store";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const activeStatuses = ["requested", "accepted", "en-route", "arrived", "in-progress"];

function AdminOverview() {
  const { jobs } = useJobStore();

  const activeJobs = jobs.filter((j) => activeStatuses.includes(j.status));
  const completed = jobs.filter((j) => j.status === "completed");
  const revenue = completed.reduce((sum, j) => sum + j.price, 0);
  const mechanicsOnJobs = new Set(
    activeJobs.map((j) => j.mechanic).filter(Boolean),
  ).size;

  const stats = [
    { label: "Active customers", value: "4,182", icon: Users, delta: "+12%" },
    { label: "Mechanics on jobs", value: String(mechanicsOnJobs), icon: Wrench, delta: "live" },
    { label: "Active jobs now", value: String(activeJobs.length), icon: Activity, delta: "live" },
    { label: "Revenue (completed)", value: ugx(revenue), icon: Banknote, delta: "+15%" },
  ];

    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3" /> {s.delta}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Live jobs</h2>
            <Link to="/admin/jobs" className="text-sm font-medium text-primary">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Job</th>
                  <th className="pb-2 font-medium">Mechanic</th>
                  <th className="pb-2 font-medium">Area</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeJobs.map((j) => (
                  <tr key={j.id} className="border-t border-border">
                    <td className="py-3 font-medium">{j.service}</td>
                    <td className="py-3 text-muted-foreground">{j.mechanic}</td>
                    <td className="py-3 text-muted-foreground">{j.area}</td>
                    <td className="py-3">
                      <StatusBadge status={j.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 font-semibold">Pending verifications</h2>
          <div className="space-y-3">
            {["Ibrahim Ssali", "Grace Atim"].map((n) => (
              <div key={n} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {n.split(" ").map((p) => p[0]).join("")}
                  </span>
                  <span className="text-sm">{n}</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-warning">
                  <Clock className="h-3 w-3" /> pending
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/admin/mechanics"
            className="mt-4 block rounded-lg bg-secondary py-2 text-center text-sm font-medium"
          >
            Review queue
          </Link>
        </div>
      </div>
    </div>
  );
}
