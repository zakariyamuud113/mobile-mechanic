import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Smartphone,
  Star,
  ArrowRight,
  Users,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { services, type ServiceId } from "@/lib/mock-data";
import type { Role } from "@/lib/job-store";

export const Route = createFileRoute("/")({
  component: Landing,
});

const roles: {
  role: Role;
  title: string;
  subtitle: string;
  desc: string;
  icon: typeof Smartphone;
}[] = [
  {
    role: "customer",
    title: "I need help",
    subtitle: "Customer app",
    desc: "Request a mechanic, track them live, pay with Mobile Money.",
    icon: Smartphone,
  },
  {
    role: "mechanic",
    title: "I'm a mechanic",
    subtitle: "Pro app",
    desc: "Go online, accept nearby jobs, and grow your earnings.",
    icon: Wrench,
  },
  {
    role: "admin",
    title: "Admin console",
    subtitle: "Dashboard",
    desc: "Verify mechanics, monitor jobs, manage the platform.",
    icon: Gauge,
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="bg-glow pointer-events-none absolute inset-0 h-[520px]" />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-12">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">RoadReady</span>
          </div>

          <div className="mx-auto mt-16 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Now launching in Kampala, Uganda
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
              Roadside help,{" "}
              <span className="text-gradient">a few taps away.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              RoadReady instantly connects drivers with verified mobile mechanics
              and roadside professionals — wherever you are, whenever you need it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/customer">
                  Get help now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/mechanic">Become a mechanic</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Role cards */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <r.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">
                {r.subtitle}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{r.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust stats */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: ShieldCheck, value: "100%", label: "Verified pros" },
            { icon: Gauge, value: "< 25 min", label: "Avg. arrival" },
            { icon: Star, value: "4.8★", label: "Avg. rating" },
            { icon: Users, value: "24/7", label: "Always on" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-2xl font-bold">Services on demand</h2>
        <p className="mt-1 text-muted-foreground">
          Transparent pricing, verified pros, real-time tracking.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold">{s.name}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">ETA {s.eta}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© 2026 RoadReady. Effortless mobility, delivered.</span>
          <span>Kampala · East Africa</span>
        </div>
      </footer>
    </div>
  );
}
