import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth, type Role } from "@/lib/auth-store";

/**
 * Client-side guard: Firebase auth is only available in the browser, so we
 * gate on the resolved session here rather than in an SSR `beforeLoad`.
 */
export function RoleGate({ role, children }: { role: Role; children: ReactNode }) {
  const { loading, profile, configured } = useAuth();
  const navigate = useNavigate();

  const allowed = profile?.role === role;

  useEffect(() => {
    if (!configured) {
      navigate({ to: "/auth", search: { role } });
      return;
    }
    if (!loading && !allowed) {
      navigate({ to: "/auth", search: { role } });
    }
  }, [loading, allowed, configured, navigate, role]);

  if (loading || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
