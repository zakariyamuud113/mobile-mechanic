import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Activity,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const nav = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Verification", to: "/admin/mechanics", icon: ShieldCheck },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Live jobs", to: "/admin/jobs", icon: Activity },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <Link to="/" className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </span>
          <span className="font-display font-semibold">RoadReady</span>
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const active =
              item.to === pathname || (item.to !== "/admin" && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          Admin · Kampala HQ
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h1 className="font-display text-lg font-semibold">Admin Console</h1>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            AD
          </span>
        </header>
        <div className="border-b border-border px-3 py-2 lg:hidden">
          <div className="flex gap-1 overflow-x-auto">
            {nav.map((item) => {
              const active =
                item.to === pathname || (item.to !== "/admin" && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <main className="p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
