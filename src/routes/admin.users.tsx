import { createFileRoute } from "@tanstack/react-router";
import { Search, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

const users = [
  { name: "Aaron Namuli", phone: "+256 772 123 456", vehicles: 3, jobs: 12, status: "Active" },
  { name: "James Mwesigwa", phone: "+256 701 998 221", vehicles: 1, jobs: 4, status: "Active" },
  { name: "Aisha Kato", phone: "+256 753 445 900", vehicles: 2, jobs: 8, status: "Active" },
  { name: "Peter Obua", phone: "+256 774 010 233", vehicles: 1, jobs: 1, status: "Suspended" },
  { name: "Ritah Nakato", phone: "+256 782 556 100", vehicles: 2, jobs: 19, status: "Active" },
];

function AdminUsers() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Customers</h2>
          <p className="text-sm text-muted-foreground">Manage customer accounts.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search customers"
            className="h-10 w-64 rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium">Vehicles</th>
              <th className="px-5 py-3 font-medium">Jobs</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.phone} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{u.phone}</td>
                <td className="px-5 py-3 text-muted-foreground">{u.vehicles}</td>
                <td className="px-5 py-3 text-muted-foreground">{u.jobs}</td>
                <td className="px-5 py-3">
                  <span
                    className={
                      u.status === "Active"
                        ? "rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success"
                        : "rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive"
                    }
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
