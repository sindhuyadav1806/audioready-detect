import { cn } from "@/lib/utils";
import type { RiskClassification } from "@/lib/types";
import { classificationLabel, riskTone } from "@/services/riskScoringService";

type Tone = "safe" | "medium" | "suspicious" | "critical" | "neutral";

const toneClass: Record<Tone, string> = {
  safe: "bg-safe/15 text-safe border-safe/40",
  medium: "bg-medium/15 text-medium border-medium/40",
  suspicious: "bg-suspicious/15 text-suspicious border-suspicious/40",
  critical: "bg-critical/15 text-critical border-critical/45",
  neutral: "bg-muted/60 text-muted-foreground border-border",
};

export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone | undefined;
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function RiskBadge({
  classification,
  score,
  className,
}: {
  classification: RiskClassification;
  score?: number | undefined;
  className?: string | undefined;
}) {
  const tone = riskTone(classification);
  return (
    <Pill tone={tone} className={className}>
      <span className="size-1.5 rounded-full bg-current" />
      {typeof score === "number" ? `${score}% · ` : ""}
      {classificationLabel(classification)}
    </Pill>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone: Tone =
    status === "Safe" || status === "Verified"
      ? "safe"
      : status === "Suspicious"
        ? "suspicious"
        : status === "High Risk" || status === "Blocked"
          ? "critical"
          : "neutral";
  return <Pill tone={tone}>{status}</Pill>;
}
