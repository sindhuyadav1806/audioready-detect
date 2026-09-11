import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AudioLines,
  BarChart3,
  Bell,
  Blocks,
  Circle,
  FileCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  PlugZap,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DemoAttackSimulation } from "./DemoAttackSimulation";

const NAV = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/live", label: "Live Detection", icon: AudioLines },
  { to: "/app/analyze", label: "Analyze Audio", icon: Activity },
  { to: "/app/verification", label: "Verification", icon: FileCheck2 },
  { to: "/app/history", label: "Risk History", icon: ShieldCheck },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/alerts", label: "Alerts", icon: Siren },
  { to: "/app/audit", label: "Audit Ledger", icon: Blocks },
  { to: "/app/api", label: "API Integration", icon: PlugZap },
  { to: "/app/privacy", label: "Privacy", icon: ShieldCheck },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, alerts, signOut, calls } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [query, setQuery] = useState("");

  const unread = alerts.filter((a) => !a.read).length;
  const matches = query.trim()
    ? calls
        .filter(
          (call) =>
            call.caller.toLowerCase().includes(query.toLowerCase()) ||
            call.id.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 aurora opacity-40" aria-hidden />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block font-display text-base font-bold leading-tight">VoxShield AI</span>
              <span className="block text-[0.65rem] tracking-[0.16em] uppercase text-muted-foreground">
                Voice Integrity
              </span>
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: "exact" in item ? item.exact : false }}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{
                className:
                  "bg-primary/15 text-primary font-medium border border-primary/30 hover:bg-primary/15 hover:text-primary",
              }}
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
              {item.to === "/app/alerts" && unread > 0 ? (
                <span className="ml-auto rounded-full bg-critical px-1.5 py-0.5 text-[0.65rem] font-semibold text-critical-foreground">
                  {unread}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <Button variant="hero" className="w-full" onClick={() => setDemoOpen(true)}>
            <Sparkles className="size-4" aria-hidden /> Demo Mode
          </Button>
          <p className="mt-2 text-[0.68rem] leading-relaxed text-muted-foreground">
            Prototype build · mock inference layer
          </p>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-background/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {/* Main */}
      <div className="lg:pl-[264px]">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-4" aria-hidden />
            </Button>

            <div className="relative hidden max-w-sm flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search calls, callers, IDs…"
                className="bg-surface/60 pl-9"
                aria-label="Search calls"
              />
              {matches.length > 0 ? (
                <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-panel)]">
                  {matches.map((call) => (
                    <button
                      key={call.id}
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-surface"
                      onClick={() => {
                        setQuery("");
                        void navigate({ to: "/app/history" });
                      }}
                    >
                      <span>{call.caller}</span>
                      <span className="text-xs text-muted-foreground">
                        {call.id} · {call.riskScore}%
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="hidden items-center gap-2 rounded-full border border-safe/40 bg-safe/10 px-3 py-1.5 text-xs font-medium text-safe md:inline-flex">
                    <Circle className="size-2 fill-current" aria-hidden /> Systems operational
                  </span>
                </TooltipTrigger>
                <TooltipContent>Mock inference layer responding normally</TooltipContent>
              </Tooltip>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/app/alerts" })}
                aria-label={`Alerts${unread ? `, ${unread} unread` : ""}`}
                className="relative"
              >
                <Bell className="size-4" aria-hidden />
                {unread > 0 ? (
                  <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-critical text-[0.6rem] font-bold text-critical-foreground">
                    {unread}
                  </span>
                ) : null}
              </Button>

              <Button variant="glass" size="sm" className="hidden sm:inline-flex" onClick={() => setDemoOpen(true)}>
                <Sparkles className="size-4" aria-hidden /> Demo
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-border bg-surface/60 py-1 pl-1 pr-3 text-left"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                      {(user?.name ?? "VS")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <span className="hidden leading-tight sm:block">
                      <span className="block text-xs font-medium">{user?.name ?? "Guest"}</span>
                      <span className="block text-[0.65rem] text-muted-foreground">{user?.role}</span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">{user?.organization}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/app/settings" })}>
                    <Settings className="size-4" aria-hidden /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      void navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="size-4" aria-hidden /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>

      <DemoAttackSimulation open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
