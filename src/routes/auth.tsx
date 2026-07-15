import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Smartphone,
  Wrench,
  Gauge,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { useAuth, type Role } from "@/lib/auth-store";
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

type Method = "phone" | "email";
type EmailMode = "signin" | "signup";

function AuthScreen() {
  const { role: initialRole } = Route.useSearch();
  const navigate = useNavigate();
  const { configured, sendOtp, verifyOtp, signInWithEmail } = useAuth();

  const [role, setRole] = useState<Role | null>(initialRole ?? null);
  const [method, setMethod] = useState<Method>("phone");
  const [emailMode, setEmailMode] = useState<EmailMode>("signup");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = roleOptions.find((r) => r.role === role);

  const requestCode = async () => {
    setError(null);
    setBusy(true);
    try {
      await sendOtp("+256" + phone);
      setStep("otp");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send the code. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const completePhone = async () => {
    if (!active) return;
    setError(null);
    setBusy(true);
    try {
      await verifyOtp(otp, name, active.role);
      navigate({ to: active.to });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid code. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const completeEmail = async () => {
    if (!active) return;
    setError(null);
    setBusy(true);
    try {
      await signInWithEmail(email.trim(), password, {
        name,
        role: active.role,
        mode: emailMode,
      });
      navigate({ to: active.to });
    } catch (e) {
      const raw = e instanceof Error ? e.message : "Sign-in failed.";
      const code = (e as { code?: string })?.code ?? "";
      const msg =
        code === "auth/email-already-in-use"
          ? "That email already has an account — switch to Sign in."
          : code === "auth/invalid-credential" || code === "auth/wrong-password"
            ? "Wrong email or password."
            : code === "auth/weak-password"
              ? "Password must be at least 6 characters."
              : code === "auth/user-not-found"
                ? "No account with that email — switch to Create account."
                : raw;
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const canSubmitEmail =
    email.includes("@") && password.length >= 6 && (emailMode === "signin" || name.trim());

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 py-8">
      <Brand size="md" />

      {/* reCAPTCHA renders here (invisible) for Firebase phone auth. */}
      <div id="recaptcha-container" />

      {!configured && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span>Firebase isn't configured yet. Add your web config to enable real sign-in.</span>
        </div>
      )}

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
            onClick={() => {
              setError(null);
              if (step === "otp") setStep("phone");
              else setRole(null);
            }}
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
                {step === "otp" ? "Verify your number" : "Sign in"}
              </h1>
            </div>
          </div>

          {step === "phone" && (
            <div className="mt-6 grid grid-cols-2 rounded-xl border border-border bg-card p-1 text-sm">
              <button
                onClick={() => {
                  setMethod("phone");
                  setError(null);
                }}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors",
                  method === "phone" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Smartphone className="h-4 w-4" /> Phone
              </button>
              <button
                onClick={() => {
                  setMethod("email");
                  setError(null);
                }}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors",
                  method === "email" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                <Mail className="h-4 w-4" /> Email
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          {step === "phone" && method === "phone" && (
            <div className="mt-6 space-y-4">
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
                disabled={phone.length < 9 || busy || !configured}
                onClick={requestCode}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send code"}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                A real SMS code is sent to verify your number.
              </p>
            </div>
          )}

          {step === "phone" && method === "email" && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 rounded-lg border border-border p-1 text-xs">
                <button
                  onClick={() => setEmailMode("signup")}
                  className={cn(
                    "rounded-md py-1.5",
                    emailMode === "signup" ? "bg-secondary font-medium" : "text-muted-foreground",
                  )}
                >
                  Create account
                </button>
                <button
                  onClick={() => setEmailMode("signin")}
                  className={cn(
                    "rounded-md py-1.5",
                    emailMode === "signin" ? "bg-secondary font-medium" : "text-muted-foreground",
                  )}
                >
                  Sign in
                </button>
              </div>

              {emailMode === "signup" && (
                <label className="block">
                  <span className="text-sm font-medium">Your name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Brian K."
                    className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </label>
              )}
              <label className="block">
                <span className="text-sm font-medium">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="At least 6 characters"
                  className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <Button
                size="lg"
                className="w-full"
                disabled={!canSubmitEmail || busy || !configured}
                onClick={completeEmail}
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : emailMode === "signup" ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to +256 {phone}.
              </p>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="––––––"
                className={cn(
                  "w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-primary",
                )}
              />
              <Button size="lg" className="w-full" disabled={otp.length < 6 || busy} onClick={completePhone}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & continue"}
              </Button>
              <button
                onClick={requestCode}
                disabled={busy}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Didn't get it? Resend code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
