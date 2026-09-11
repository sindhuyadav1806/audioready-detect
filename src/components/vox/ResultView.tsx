import { Clock, Fingerprint, Languages, Mic } from "lucide-react";

import type { VoiceAnalysisResult } from "@/lib/types";
import { classificationLabel, voiceTypeLabel } from "@/services/riskScoringService";
import { formatDuration } from "@/hooks/useVoiceRecorder";
import { ContextRiskCard } from "./ContextRiskCard";
import { DetectionBreakdown } from "./DetectionBreakdown";
import { ExplainableAI } from "./ExplainableAI";
import { FraudPrevention } from "./FraudPrevention";
import { RiskGauge } from "./RiskGauge";
import { languageLabel } from "./LanguageSelector";
import { Pill } from "./RiskBadge";

export function ResultView({
  result,
  callId,
  showPrevention = true,
}: {
  result: VoiceAnalysisResult;
  callId: string;
  showPrevention?: boolean | undefined;
}) {
  const facts: [typeof Mic, string, string][] = [
    [Mic, "Source", result.metadata.source.replace("-", " ")],
    [Clock, "Duration", formatDuration(result.metadata.durationSeconds)],
    [Languages, "Detected language", languageLabel(result.detectedLanguage)],
    [Fingerprint, "Voice type", voiceTypeLabel(result.voiceType)],
  ];

  return (
    <div className="space-y-6">
      <section className="glass rise-in overflow-hidden rounded-2xl">
        <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr] md:items-center">
          <RiskGauge score={result.overallRiskScore} />
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              Voice integrity result · {callId}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              {result.overallRiskScore}% {classificationLabel(result.classification)}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {result.overallRiskScore > 60
                ? "Possible AI-generated or cloned voice detected. Independent verification is required before acting on this request."
                : "No strong synthetic-speech indicators were found in this sample."}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map(([Icon, label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-surface/50 p-3">
                  <p className="flex items-center gap-1.5 text-[0.68rem] tracking-[0.12em] uppercase text-muted-foreground">
                    <Icon className="size-3.5" aria-hidden /> {label}
                  </p>
                  <p className="mt-1 text-sm font-medium capitalize">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-base font-semibold">Detection breakdown</h3>
            <Pill tone="neutral">6 layers</Pill>
          </div>
          <div className="mt-5">
            <DetectionBreakdown result={result} />
          </div>
        </section>
        <ExplainableAI result={result} />
      </div>

      {result.metadata.context ? (
        <ContextRiskCard context={result.metadata.context} contextScore={result.contextualRiskScore} />
      ) : null}

      {showPrevention ? <FraudPrevention result={result} callId={callId} /> : null}
    </div>
  );
}
