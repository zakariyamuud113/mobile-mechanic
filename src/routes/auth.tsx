import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Smartphone, Wrench, Gauge, ChevronLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { useJobStore, type Role } from "@/lib/job-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { role?: Role } => {
    const role = search.role;
    return role === "customer" || role === "mechanic" || role === "admin"
      ? { role }
      : {};
  },
  component: AuthScreen,
});

const roleOptions: { role: Role; title: string; desc: string; icon: typeof Smartphone; to: string }[] = [
  { role: "customer", title: "I need help", desc: "Request a mechanic & track them live.", icon: Smartphone, to: "/customer" },
  { role: "mechanic", title: "I'm a mechanic", desc: "Accept nearby jobs and earn.", icon: Wrench, to: "/mechanic" },
  { role: "admin", title: "Admin console", desc: "Verify pros and monitor the platform.", icon: Gauge, to: "/admin" },
];

function AuthScreen() {
  const { role: initialRole } = Route.useSearch();
  const navigate = useNavigate();
  const { signIn } = useJobStore();

  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");

  const active = roleOptions.find((r) => r.role === role);

  const complete = () => {
    if (!active) return;
    signIn(active.role, "+256 " + phone, name);
    navigate({ to: active.to });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
      <Brand size="md" />

      {!role && (
        <div className="mt-12">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how you'd like to continue.
          </p>
          <div className="mt-6 space-y-3">
            {roleOptions.map((r) => (
              <button
                key={r.role}
                onClick={() => setRole(r.role)}
                className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      )}

      {role && (
        <div className="mt-10">
          <button
            onClick={() => (step === "otp" ? setStep("phone") : setRole(null))}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <div className="mt-6 flex items-center gap-3">
            {active && (
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <active.icon className="h-5 w-5" />
              </span>
            )}
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {active?.title}
              </p>
              <h1 className="text-xl font-bold">
                {step === "phone" ? "Sign in" : "Verify your number"}
              </h1>
            </div>
          </div>

          {step === "phone" ? (
            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-medium">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Brian K."
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Phone number</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-primary">
                  <span className="text-sm text-muted-foreground">+256</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 9))}
                    inputMode="numeric"
                    placeholder="7XX XXX XXX"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </label>
              <Button
                size="lg"
                className="w-full"
                disabled={phone.length < 9}
                onClick={() => setStep("otp")}
              >
                Send code
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Prototype sign-in — no real SMS is sent.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the 4-digit code sent to +256 {phone}. (Use any digits.)
              </p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                inputMode="numeric"
                placeholder="––––"
                className={cn(
                  "w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-primary",
                )}
              />
              <Button size="lg" className="w-full" disabled={otp.length < 4} onClick={complete}>
                Verify & continue
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
