import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutList, Wallet, User } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";
import { RoleGate } from "@/components/role-gate";

export const Route = createFileRoute("/mechanic")({
  component: MechanicLayout,
});

function MechanicLayout() {
  return (
    <RoleGate role="mechanic">
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
    </RoleGate>
  );
}
