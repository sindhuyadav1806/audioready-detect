import { Link2, ShieldCheck } from "lucide-react";

import type { AuditEvent } from "@/lib/types";
import { shortHash } from "@/services/auditService";
import { Pill } from "./RiskBadge";
import { formatDateTime } from "./CallTable";

export function AuditChainVisual({ events }: { events: AuditEvent[] }) {
  const tail = events.slice(-5);
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {tail.map((event, index) => (
        <div key={event.eventId} className="flex items-center gap-2">
          <div className="min-w-[168px] rounded-xl border border-primary/30 bg-primary/10 px-3 py-2">
            <p className="font-mono text-xs text-primary">{shortHash(event.hash)}</p>
            <p className="mt-1 truncate text-[0.7rem] text-muted-foreground">{event.eventType}</p>
          </div>
          {index < tail.length - 1 ? (
            <Link2 className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function AuditChainTable({ events }: { events: AuditEvent[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs tracking-wide uppercase text-muted-foreground">
            <th className="px-3 py-2">Event ID</th>
            <th className="px-3 py-2">Timestamp</th>
            <th className="px-3 py-2">Call ID</th>
            <th className="px-3 py-2">Event</th>
            <th className="px-3 py-2">Risk</th>
            <th className="px-3 py-2">Action</th>
            <th className="px-3 py-2">Hash</th>
            <th className="px-3 py-2">Previous hash</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {[...events].reverse().map((event) => (
            <tr key={event.eventId} className="border-b border-border/50 hover:bg-surface/60">
              <td className="px-3 py-2.5 font-medium">{event.eventId}</td>
              <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                {formatDateTime(event.timestamp)}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{event.callId}</td>
              <td className="px-3 py-2.5">{event.eventType}</td>
              <td className="px-3 py-2.5 tabular-nums">{event.riskScore ?? "—"}</td>
              <td className="px-3 py-2.5 text-muted-foreground">{event.action}</td>
              <td className="px-3 py-2.5 font-mono text-xs text-primary">{shortHash(event.hash)}</td>
              <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground">
                {shortHash(event.previousHash)}
              </td>
              <td className="px-3 py-2.5">
                <Pill tone="safe">
                  <ShieldCheck className="size-3" aria-hidden /> {event.status}
                </Pill>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
