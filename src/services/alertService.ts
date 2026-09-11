import type { AlertSeverity, SecurityAlert, VoiceAnalysisResult } from "@/lib/types";

export function severityLabel(severity: AlertSeverity): string {
  switch (severity) {
    case "HIGH":
      return "High Risk";
    case "SUSPICIOUS":
      return "Suspicious";
    case "VERIFICATION":
      return "Verification Required";
  }
}

export function severityTone(severity: AlertSeverity): "critical" | "suspicious" | "medium" {
  switch (severity) {
    case "HIGH":
      return "critical";
    case "SUSPICIOUS":
      return "suspicious";
    case "VERIFICATION":
      return "medium";
  }
}

/** Derives an alert from an analysis result, or null when nothing is notable. */
export function alertFromAnalysis(
  result: VoiceAnalysisResult,
  callId: string,
): SecurityAlert | null {
  if (result.overallRiskScore <= 30) return null;
  const severity: AlertSeverity =
    result.overallRiskScore > 80 ? "HIGH" : result.overallRiskScore > 60 ? "SUSPICIOUS" : "VERIFICATION";
  const caller = result.metadata.context?.caller ?? "Unknown Caller";
  return {
    id: `ALRT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    severity,
    title:
      severity === "HIGH"
        ? `Possible impersonation detected — ${caller}`
        : severity === "SUSPICIOUS"
          ? `Speaker consistency mismatch — ${caller}`
          : `Secondary verification recommended — ${caller}`,
    message: result.explanation,
    callId,
    createdAt: result.createdAt,
    read: false,
    state: "open",
  };
}
