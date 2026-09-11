import type { AuditEvent } from "@/lib/types";

/**
 * Prototype tamper-evident audit ledger.
 *
 * Each event stores the hash of its own payload plus the previous event's hash,
 * forming a verifiable chain. A production implementation can anchor these
 * records to a permissioned blockchain — this is not a blockchain.
 */

const GENESIS_HASH = "0000000000000000";

function hash(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    h1 = Math.imul(h1 ^ input.charCodeAt(i), 16777619) >>> 0;
    h2 = Math.imul(h2 + input.charCodeAt(i) * (i + 7), 2654435761) >>> 0;
  }
  return (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).slice(0, 16);
}

export function shortHash(value: string): string {
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export interface AuditInput {
  callId: string;
  eventType: string;
  action: string;
  riskScore?: number | null;
}

export function createAuditEvent(input: AuditInput, chain: AuditEvent[]): AuditEvent {
  const previousHash = chain.length > 0 ? chain[chain.length - 1]!.hash : GENESIS_HASH;
  const timestamp = new Date().toISOString();
  const eventId = `EVT-${(chain.length + 1).toString().padStart(5, "0")}`;
  const payload = `${eventId}|${input.callId}|${timestamp}|${input.eventType}|${input.riskScore ?? ""}|${input.action}|${previousHash}`;
  return {
    eventId,
    callId: input.callId,
    timestamp,
    eventType: input.eventType,
    riskScore: input.riskScore ?? null,
    action: input.action,
    hash: hash(payload),
    previousHash,
    status: "Verified",
  };
}

/** Recomputes the chain and returns the index of the first broken link, or -1. */
export function verifyChain(chain: AuditEvent[]): number {
  for (let i = 0; i < chain.length; i++) {
    const event = chain[i]!;
    const expectedPrevious = i === 0 ? GENESIS_HASH : chain[i - 1]!.hash;
    if (event.previousHash !== expectedPrevious) return i;
    const payload = `${event.eventId}|${event.callId}|${event.timestamp}|${event.eventType}|${event.riskScore ?? ""}|${event.action}|${event.previousHash}`;
    if (hash(payload) !== event.hash) return i;
  }
  return -1;
}

export function seedAuditChain(): AuditEvent[] {
  const chain: AuditEvent[] = [];
  const seeds: AuditInput[] = [
    { callId: "CALL-90325", eventType: "VOICE_ANALYSIS_COMPLETED", action: "Allowed", riskScore: 16 },
    { callId: "CALL-90333", eventType: "HIGH_RISK_DETECTED", action: "Transaction blocked", riskScore: 84 },
    { callId: "CALL-90333", eventType: "VERIFICATION_REQUESTED", action: "Trusted callback", riskScore: 84 },
    { callId: "CALL-90366", eventType: "VOICE_ANALYSIS_COMPLETED", action: "Transaction blocked", riskScore: 92 },
    { callId: "CALL-90398", eventType: "VERIFICATION_COMPLETED", action: "MFA verified", riskScore: 64 },
    { callId: "CALL-90409", eventType: "ALERT_ESCALATED", action: "Supervisor approval", riskScore: 72 },
  ];
  for (const seed of seeds) chain.push(createAuditEvent(seed, chain));
  return chain;
}
