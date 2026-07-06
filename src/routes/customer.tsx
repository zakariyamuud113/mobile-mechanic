import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Home, ClipboardList, User } from "lucide-react";
import { MobileShell } from "@/components/mobile-shell";

export const Route = createFileRoute("/customer")({
  component: CustomerLayout,
});

function CustomerLayout() {
  return (
    <MobileShell
      accent="Customer"
      nav={[
        { label: "Home", to: "/customer", icon: Home },
        { label: "Activity", to: "/customer/history", icon: ClipboardList },
        { label: "Profile", to: "/customer/profile", icon: User },
      ]}
    >
      <Outlet />
    </MobileShell>
  );
}
