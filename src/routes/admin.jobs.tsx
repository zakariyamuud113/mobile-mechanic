import { createFileRoute } from "@tanstack/react-router";
import { MapMock } from "@/components/map-mock";
import { StatusBadge } from "@/components/status-badge";
import { ugx } from "@/lib/mock-data";
import { useJobStore } from "@/lib/job-store";

export const Route = createFileRoute("/admin/jobs")({
  component: AdminJobs,
});

function AdminJobs() {
  const { jobs } = useJobStore();
  const activeCount = jobs.filter((j) =>
    ["requested", "accepted", "en-route", "arrived", "in-progress"].includes(j.status),
  ).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Live jobs</h2>
        <p className="text-sm text-muted-foreground">Monitor all active and recent service requests.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <MapMock className="h-64 lg:col-span-1" label={`${activeCount} active jobs across Kampala`} showRoute />

        <div className="overflow-x-auto rounded-2xl border border-border bg-card lg:col-span-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Mechanic</th>
                <th className="px-4 py-3 font-medium">Fee</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{j.id}</td>
                  <td className="px-4 py-3 font-medium">{j.service}</td>
                  <td className="px-4 py-3 text-muted-foreground">{j.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{j.mechanic ?? "—"}</td>
                  <td className="px-4 py-3">{ugx(j.price)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={j.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
