import { Radar } from "lucide-react";

import type { CallContext } from "@/lib/types";
import { Pill } from "./RiskBadge";

function inr(amount: number): string {
  if (amount === 0) return "None";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function ContextRiskCard({
  context,
  contextScore,
}: {
  context: CallContext;
  contextScore: number;
}) {
  const level = contextScore > 70 ? "HIGH" : contextScore > 45 ? "MEDIUM" : "LOW";
  const tone = contextScore > 70 ? "critical" : contextScore > 45 ? "medium" : "safe";

  const rows: [string, string][] = [
    ["Caller", context.caller],
    ["Caller ID", context.callerId],
    ["Known contact", context.knownContact ? "Yes" : "No"],
    ["Transaction", inr(context.transactionAmount)],
    ["Transaction type", context.transactionType],
    ["Previous interaction", context.previousInteraction],
    ["Time", context.timeOfDay],
    ["Historical fraud indicator", context.historicalFraudIndicator],
  ];

  return (
    <section className="glass rounded-2xl p-5">
      <header className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold">
          <Radar className="size-4 text-primary" aria-hidden />
          Contextual Risk Assessment
        </h3>
        <Pill tone={tone}>Context risk: {level}</Pill>
      </header>
      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2">
            <dt className="text-xs tracking-wide uppercase text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Voice analysis should never be the only security signal. Contextual factors — amount, caller
        history, time of day and prior fraud indicators — are fused with the acoustic layers before a
        recommendation is produced.
      </p>
    </section>
  );
}
