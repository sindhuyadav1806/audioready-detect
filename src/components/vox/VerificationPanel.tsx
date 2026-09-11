import { useState } from "react";
import { BadgeCheck, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/store";
import {
  SECURITY_QUESTIONS,
  VERIFICATION_METHODS,
  completeVerification,
  sendVerificationRequest,
} from "@/services/verificationService";
import type { VerificationMethod, VerificationRequest } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Pill } from "./RiskBadge";

export function VerificationPanel({
  callId,
  riskScore,
  onCompleted,
}: {
  callId: string;
  riskScore: number;
  onCompleted?: (() => void) | undefined;
}) {
  const { addVerification, updateVerification, addAudit } = useApp();
  const [method, setMethod] = useState<VerificationMethod>("callback");
  const [sending, setSending] = useState(false);
  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [otp, setOtp] = useState("");
  const [completing, setCompleting] = useState(false);
  const [done, setDone] = useState(false);

  const send = async () => {
    setSending(true);
    try {
      const created = await sendVerificationRequest(callId, method);
      setRequest(created);
      addVerification(created);
      addAudit({
        callId,
        eventType: "VERIFICATION_REQUESTED",
        action: created.detail,
        riskScore,
      });
      toast.success("Verification request sent successfully.", { description: created.detail });
    } catch {
      toast.error("Verification request failed. Please retry or use another method.");
    } finally {
      setSending(false);
    }
  };

  const complete = async () => {
    if (!request) return;
    setCompleting(true);
    try {
      const updated = await completeVerification(request, method === "mfa" ? otp : undefined);
      updateVerification(updated);
      if (updated.status === "completed") {
        setDone(true);
        addAudit({
          callId,
          eventType: "VERIFICATION_COMPLETED",
          action: `${method} verified`,
          riskScore,
        });
        toast.success("Verification completed.", { description: "Audit event recorded." });
        onCompleted?.();
      } else {
        toast.error("Verification failed — the code must be 6 digits.");
      }
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {VERIFICATION_METHODS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setMethod(option.id);
              setRequest(null);
              setDone(false);
            }}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors",
              method === option.id
                ? "border-primary/60 bg-primary/10"
                : "border-border bg-surface/50 hover:border-primary/40",
            )}
            aria-pressed={method === option.id}
          >
            <p className="font-medium">{option.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="hero" onClick={send} disabled={sending}>
          {sending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          Send verification request
        </Button>
        {request ? <Pill tone="medium">Request {request.id} sent</Pill> : null}
        {done ? (
          <Pill tone="safe">
            <BadgeCheck className="size-3.5" aria-hidden /> Verified
          </Pill>
        ) : null}
      </div>

      {request && !done ? (
        <div className="rounded-xl border border-border bg-surface/50 p-4">
          <p className="text-sm font-medium">{request.detail}</p>
          {method === "mfa" ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                className="w-44 bg-background/60"
                aria-label="One-time passcode"
              />
              <Button onClick={complete} disabled={completing}>
                {completing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Confirm OTP
              </Button>
            </div>
          ) : method === "knowledge" ? (
            <div className="mt-3 space-y-2">
              <p className="text-xs tracking-wide uppercase text-muted-foreground">Security question</p>
              <p className="text-sm">{SECURITY_QUESTIONS[0]}</p>
              <Button onClick={complete} disabled={completing}>
                {completing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Mark answer as correct
              </Button>
            </div>
          ) : (
            <Button className="mt-3" onClick={complete} disabled={completing}>
              {completing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Mark verification as completed
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
