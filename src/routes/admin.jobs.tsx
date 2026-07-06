import { createFileRoute } from "@tanstack/react-router";
import { MapMock } from "@/components/map-mock";
import { StatusBadge } from "@/components/status-badge";
import { ugx, type JobStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/jobs")({
  component: AdminJobs,
});

const jobs: {
  id: string;
  service: string;
  customer: string;
  mechanic: string;
  area: string;
  price: number;
  status: JobStatus;
}[] = [
  { id: "r1102", service: "Battery Jump Start", customer: "James M.", mechanic: "David Okello", area: "Bugolobi", price: 40000, status: "en-route" },
  { id: "r1103", service: "Won't Start Diagnosis", customer: "Aisha K.", mechanic: "Sarah Nabirye", area: "Naguru", price: 50000, status: "in-progress" },
  { id: "r1104", service: "Towing", customer: "Peter O.", mechanic: "Ibrahim Ssali", area: "Ntinda", price: 90000, status: "accepted" },
  { id: "r1105", service: "Fuel Delivery", customer: "Ritah N.", mechanic: "Grace Atim", area: "Kololo", price: 35000, status: "arrived" },
  { id: "r1099", service: "Flat Tire Assistance", customer: "Sam W.", mechanic: "David Okello", area: "Muyenga", price: 45000, status: "completed" },
];

function AdminJobs() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Live jobs</h2>
        <p className="text-sm text-muted-foreground">Monitor all active and recent service requests.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <MapMock className="h-64 lg:col-span-1" label="18 active jobs across Kampala" showRoute />

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
                  <td className="px-4 py-3 text-muted-foreground">{j.mechanic}</td>
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
