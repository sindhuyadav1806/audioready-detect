import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "primary",
  className,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string | undefined;
  tone?: "primary" | "safe" | "medium" | "suspicious" | "critical" | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("glass rise-in rounded-2xl p-5 transition-transform hover:-translate-y-0.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-muted-foreground">{label}</p>
        <span
          className="grid size-9 place-items-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklab, var(--${tone}) 18%, transparent)` }}
        >
          <Icon className="size-4" style={{ color: `var(--${tone})` }} aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
