import { createFileRoute } from "@tanstack/react-router";
import { LiveMap } from "@/components/live-map";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { ugx, KAMPALA, coordForLocation, mechanics as roster } from "@/lib/mock-data";
import { useJobStore } from "@/lib/job-store";

export const Route = createFileRoute("/admin/jobs")({
  component: AdminJobs,
});

function AdminJobs() {
  const { jobs, dispatchJob } = useJobStore();
  const activeJobs = jobs.filter((j) =>
    ["requested", "accepted", "en-route", "arrived", "in-progress"].includes(j.status),
  );
  const activeCount = activeJobs.length;
  const markers = activeJobs.map((j) => j.coord ?? coordForLocation(j.location));

  const handleDispatch = (jobId: string) => {
    const approved = roster.filter((m) => m.status === "approved");
    const options = approved.map((m, i) => `${i + 1}. ${m.name} (${m.specialty})`).join("\n");
    const pick = window.prompt(`Assign a mechanic to ${jobId}:\n\n${options}\n\nEnter number:`);
    const idx = pick ? parseInt(pick, 10) - 1 : -1;
    const chosen = approved[idx];
    if (chosen) dispatchJob(jobId, chosen.name, chosen.phone);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Live jobs</h2>
        <p className="text-sm text-muted-foreground">Monitor all active and recent service requests.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <LiveMap
          className="h-64 lg:col-span-1"
          label={`${activeCount} active jobs across Kampala`}
          customer={KAMPALA}
          markers={markers}
          zoom={12}
        />

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
                <th className="px-4 py-3 font-medium text-right">Action</th>
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
                  <td className="px-4 py-3 text-right">
                    {j.status === "requested" ? (
                      <Button size="sm" variant="secondary" onClick={() => handleDispatch(j.id)}>
                        Dispatch
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
