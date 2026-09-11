import { CheckCircle2, PhoneCall, PhoneOff, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import type { VoiceAnalysisResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export function FraudPrevention({
  result,
  callId,
}: {
  result: VoiceAnalysisResult;
  callId: string;
}) {
  const navigate = useNavigate();
  const { addAudit } = useApp();
  const highRisk = result.overallRiskScore > 60;

  const log = (eventType: string, action: string, message: string) => {
    addAudit({ callId, eventType, action, riskScore: result.overallRiskScore });
    toast.success(message, { description: `Audit event recorded for ${callId}.` });
  };

  if (!highRisk) {
    return (
      <section className="rounded-2xl border border-safe/40 bg-safe/10 p-5">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-safe">
          <ShieldCheck className="size-5" aria-hidden /> Voice appears consistent
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Continue normal verification procedures. No impersonation indicators were raised above the
          configured risk threshold.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="safe"
            onClick={() => log("CALL_ALLOWED", "Allowed", "Call cleared for standard handling")}
          >
            <CheckCircle2 className="size-4" aria-hidden /> Continue call
          </Button>
          <Button variant="glass" onClick={() => navigate({ to: "/app/verification" })}>
            <UserCheck className="size-4" aria-hidden /> Run optional verification
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-critical/45 bg-critical/10 p-5">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-critical">
        <ShieldAlert className="size-5" aria-hidden /> Potential impersonation detected
      </h3>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-critical">
        Recommended action: do not approve transaction
      </p>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {result.recommendedActions.map((action) => (
          <li key={action} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-critical" aria-hidden />
            {action}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button variant="hero" onClick={() => navigate({ to: "/app/verification" })}>
          <UserCheck className="size-4" aria-hidden /> Verify caller
        </Button>
        <Button
          variant="glass"
          onClick={() => {
            log("VERIFICATION_REQUESTED", "MFA requested", "MFA request queued");
            navigate({ to: "/app/verification" });
          }}
        >
          Request MFA
        </Button>
        <Button
          variant="glass"
          onClick={() => log("VERIFICATION_REQUESTED", "Trusted callback", "Trusted callback initiated")}
        >
          <PhoneCall className="size-4" aria-hidden /> Call back trusted number
        </Button>
        <Button
          variant="subtle"
          onClick={() => log("ALERT_ESCALATED", "Supervisor approval", "Escalated to supervisor")}
        >
          Escalate to supervisor
        </Button>
        <Button
          variant="danger"
          onClick={() => log("CALL_BLOCKED", "Transaction blocked", "Call blocked and transaction stopped")}
        >
          <PhoneOff className="size-4" aria-hidden /> Block / end call
        </Button>
      </div>
    </section>
  );
}
