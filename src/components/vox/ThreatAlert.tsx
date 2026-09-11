import { ArrowUpRight, BellRing, Check, ShieldAlert, TriangleAlert } from "lucide-react";

import type { SecurityAlert } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { severityLabel, severityTone } from "@/services/alertService";
import { Pill } from "./RiskBadge";
import { formatDateTime } from "./CallTable";

const icons = {
  HIGH: ShieldAlert,
  SUSPICIOUS: TriangleAlert,
  VERIFICATION: BellRing,
};

export function ThreatAlert({
  alert,
  onRead,
  onResolve,
  onEscalate,
}: {
  alert: SecurityAlert;
  onRead: () => void;
  onResolve: () => void;
  onEscalate: () => void;
}) {
  const Icon = icons[alert.severity];
  const tone = severityTone(alert.severity);

  return (
    <article
      className="glass rounded-2xl p-5"
      style={!alert.read ? { borderColor: `color-mix(in oklab, var(--${tone}) 45%, transparent)` } : undefined}
    >
      <div className="flex flex-wrap items-start gap-4">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: `color-mix(in oklab, var(--${tone}) 18%, transparent)`, color: `var(--${tone})` }}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={tone}>{severityLabel(alert.severity)}</Pill>
            {!alert.read ? <Pill tone="neutral">Unread</Pill> : null}
            {alert.state !== "open" ? <Pill tone="neutral">{alert.state}</Pill> : null}
          </div>
          <h3 className="mt-2 font-display text-base font-semibold">{alert.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {alert.callId} · {formatDateTime(alert.createdAt)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="subtle" size="sm" onClick={onRead} disabled={alert.read}>
          <Check className="size-3.5" aria-hidden /> Mark as read
        </Button>
        <Button variant="safe" size="sm" onClick={onResolve} disabled={alert.state === "resolved"}>
          Resolve
        </Button>
        <Button variant="danger" size="sm" onClick={onEscalate} disabled={alert.state === "escalated"}>
          <ArrowUpRight className="size-3.5" aria-hidden /> Escalate
        </Button>
      </div>
    </article>
  );
}
