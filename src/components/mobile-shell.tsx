import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

/**
 * Mobile-first app shell with a fixed bottom navigation bar,
 * centered inside a phone-like column on larger screens.
 */
export function MobileShell({
  children,
  nav,
  accent = "Customer",
}: {
  children: React.ReactNode;
  nav: NavItem[];
  accent?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col border-x border-border/60 bg-background">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
            ← RoadReady
          </Link>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {accent}
          </span>
        </div>
        <main className="flex-1 px-5 pb-28">{children}</main>
        <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur">
          <div className="flex items-center justify-around px-2 py-2">
            {nav.map((item) => {
              const active =
                item.to === pathname ||
                (item.to !== "/" && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
