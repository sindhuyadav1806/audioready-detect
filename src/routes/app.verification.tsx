import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ShieldQuestion } from "lucide-react";

import { PageHeader } from "@/components/vox/AppShell";
import { VerificationPanel } from "@/components/vox/VerificationPanel";
import { Pill } from "@/components/vox/RiskBadge";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { formatDateTime } from "@/components/vox/CallTable";
import { useApp } from "@/lib/store";
import { VERIFICATION_METHODS } from "@/services/verificationService";

export const Route = createFileRoute("/app/verification")({
  component: Verification,
});

function Verification() {
  const { latestResult, calls, verifications } = useApp();
  const target = latestResult ?? null;
  const callId = target?.id ?? calls[0]?.id ?? "CALL-90411";
  const riskScore = target?.overallRiskScore ?? calls[0]?.riskScore ?? 87;

  return (
    <>
      <PageHeader
        title="Secure Caller Verification"
        description="Voice analysis is one signal. Confirm caller identity through an independent channel before approving sensitive requests."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass rounded-2xl p-5">
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-safe/50 bg-safe/15 text-safe">
                <CheckCircle2 className="size-4" aria-hidden />
              </span>
              <div>
                <p className="font-medium">Step 1 — Voice analysis completed</p>
                <p className="text-sm text-muted-foreground">
                  {callId} scored {riskScore}% impersonation risk.{" "}
                  {riskScore > 60
                    ? "System recommendation: additional verification required."
                    : "System recommendation: standard procedures apply."}
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/50 bg-primary/15 text-primary">
                <ShieldQuestion className="size-4" aria-hidden />
              </span>
              <div>
                <p className="font-medium">Step 2 — Identity verification</p>
                <p className="text-sm text-muted-foreground">
                  Choose a channel below and dispatch the request.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-6">
            <VerificationPanel callId={callId} riskScore={riskScore} />
          </div>
        </section>

        <div className="space-y-6">
          <section className="glass rounded-2xl p-5">
            <h2 className="font-display text-base font-semibold">Available channels</h2>
            <ul className="mt-3 space-y-3">
              {VERIFICATION_METHODS.map((method) => (
                <li key={method.id} className="rounded-xl border border-border bg-surface/50 p-3">
                  <p className="text-sm font-medium">{method.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{method.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-2xl p-5">
            <h2 className="font-display text-base font-semibold">Verification log</h2>
            {verifications.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No verification requests yet. Dispatched requests appear here with their status.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {verifications.slice(0, 6).map((request) => (
                  <li key={request.id} className="rounded-xl border border-border bg-surface/50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{request.id}</p>
                      <Pill tone={request.status === "completed" ? "safe" : request.status === "failed" ? "critical" : "medium"}>
                        {request.status}
                      </Pill>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {request.callId} · {request.detail}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(request.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <Disclaimer className="mt-6" compact />
    </>
  );
}
