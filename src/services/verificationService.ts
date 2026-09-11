import type { VerificationMethod, VerificationRequest } from "@/lib/types";

export const VERIFICATION_METHODS: {
  id: VerificationMethod;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    id: "callback",
    title: "Trusted Callback",
    description: "Disconnect and call the saved trusted number on record.",
    detail: "Callback initiated to the trusted number ending 1288.",
  },
  {
    id: "mfa",
    title: "MFA / OTP",
    description: "Send a one-time passcode to the enrolled device.",
    detail: "6-digit OTP dispatched to the enrolled device.",
  },
  {
    id: "supervisor",
    title: "Supervisor Approval",
    description: "Route the request to a supervisor for dual authorisation.",
    detail: "Approval request routed to the on-duty supervisor.",
  },
  {
    id: "knowledge",
    title: "Knowledge Verification",
    description: "Ask a predefined security question from the customer profile.",
    detail: "Security question released to the agent console.",
  },
];

export const SECURITY_QUESTIONS = [
  "What is the branch where this account was opened?",
  "Name the last beneficiary added to this account.",
  "What is the approximate value of the last debit transaction?",
];

/** Mock verification dispatch. Replace with POST /api/v1/verify-speaker later. */
export async function sendVerificationRequest(
  callId: string,
  method: VerificationMethod,
): Promise<VerificationRequest> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const config = VERIFICATION_METHODS.find((m) => m.id === method)!;
  return {
    id: `VR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    callId,
    method,
    status: "sent",
    createdAt: new Date().toISOString(),
    detail: config.detail,
  };
}

export async function completeVerification(request: VerificationRequest, code?: string) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const ok = !code || code.replace(/\D/g, "").length === 6;
  return { ...request, status: ok ? ("completed" as const) : ("failed" as const) };
}
