import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutList, Wallet, User } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/mechanic")({
  component: MechanicLayout,
});

function MechanicLayout() {
  return (
    <MobileShell
      accent="Mechanic"
      nav={[
        { label: "Jobs", to: "/mechanic", icon: LayoutList },
        { label: "Earnings", to: "/mechanic/earnings", icon: Wallet },
        { label: "Profile", to: "/mechanic/profile", icon: User },
      ]}
    >
      <Outlet />
    </MobileShell>
  );
}
