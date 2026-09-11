import { useCallback, useEffect, useRef, useState } from "react";
import { Ban, PhoneIncoming, Play, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SCENARIOS } from "@/lib/demoData";
import type { AttackScenario, VoiceAnalysisResult } from "@/lib/types";
import { useApp } from "@/lib/store";
import { analyzeVoice } from "@/services/voiceAnalysisService";
import { AnalysisTimeline } from "./AnalysisTimeline";
import { RiskGauge } from "./RiskGauge";
import { DetectionBreakdown } from "./DetectionBreakdown";
import { VoiceWaveform } from "./VoiceWaveform";
import { Pill } from "./RiskBadge";
import { cn } from "@/lib/utils";

const DEMO_STAGES = [
  "Audio captured",
  "Acoustic analysis",
  "Spectral analysis",
  "Prosody analysis",
  "Speaker consistency",
  "Context analysis",
] as const;

type Phase = "select" | "incoming" | "analyzing" | "result";

export function DemoAttackSimulation({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { recordAnalysis } = useApp();
  const [scenario, setScenario] = useState<AttackScenario>(SCENARIOS[0]!);
  const [phase, setPhase] = useState<Phase>("select");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [callId, setCallId] = useState<string>("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPhase("select");
    setStage(0);
    setResult(null);
    setCallId("");
  }, [clearTimers]);

  const run = useCallback(
    (selected: AttackScenario) => {
      clearTimers();
      setScenario(selected);
      setResult(null);
      setStage(0);
      setPhase("incoming");

      timers.current.push(
        setTimeout(() => {
          setPhase("analyzing");
          DEMO_STAGES.forEach((_, index) => {
            timers.current.push(setTimeout(() => setStage(index + 1), 1500 * (index + 1)));
          });
          timers.current.push(
            setTimeout(async () => {
              const analysis = await analyzeVoice(
                `demo:${selected.id}`,
                {
                  source: "demo",
                  durationSeconds: 42,
                  language: selected.language,
                  context: selected.context,
                  scenarioId: selected.id,
                },
                { targetRisk: selected.expectedRisk },
              );
              const call = recordAnalysis(analysis, selected.caller);
              setCallId(call.id);
              setResult(analysis);
              setPhase("result");
            }, 1500 * DEMO_STAGES.length + 400),
          );
        }, 2200),
      );
    },
    [clearTimers, recordAnalysis],
  );

  const highRisk = (result?.overallRiskScore ?? 0) > 60;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Demo mode — end-to-end attack simulation
          </DialogTitle>
        </DialogHeader>

        {phase === "select" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a scenario. Each one produces a different analysis breakdown, recommendation and
              audit trail. The simulation runs for roughly 10 seconds.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => run(item)}
                  className={cn(
                    "rounded-xl border border-border bg-surface/60 p-4 text-left transition-colors hover:border-primary/60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{item.title}</p>
                    <Pill tone={item.expectedRisk > 80 ? "critical" : item.expectedRisk > 60 ? "suspicious" : "safe"}>
                      {item.expectedRisk}%
                    </Pill>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{item.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <Play className="size-3" aria-hidden /> Run scenario
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {phase === "incoming" ? (
          <div className="space-y-5 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary animate-pulse-ring">
              <PhoneIncoming className="size-7" aria-hidden />
            </span>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Incoming call</p>
              <h3 className="mt-1 font-display text-xl font-semibold">{scenario.caller}</h3>
              <p className="text-sm text-muted-foreground">{scenario.callerId}</p>
            </div>
            <p className="mx-auto max-w-lg rounded-xl border border-border bg-surface/60 p-4 text-sm italic">
              “{scenario.transcript}”
            </p>
            <VoiceWaveform height={90} />
          </div>
        ) : null}

        {phase === "analyzing" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold">{scenario.caller}</h3>
                <p className="text-sm text-muted-foreground">{scenario.callerId} · live analysis</p>
              </div>
              <Pill tone="medium">Analysing…</Pill>
            </div>
            <VoiceWaveform height={110} />
            <AnalysisTimeline stages={DEMO_STAGES} currentStage={stage} />
          </div>
        ) : null}

        {phase === "result" && result ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <RiskGauge score={result.overallRiskScore} size={170} />
              <div className="flex-1">
                <h3
                  className="font-display text-xl font-bold"
                  style={{ color: highRisk ? "var(--critical)" : "var(--safe)" }}
                >
                  {highRisk ? "Possible AI voice clone" : "Voice integrity verified"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{result.explanation}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {scenario.title} · {callId}
                </p>
              </div>
            </div>

            <DetectionBreakdown result={result} />

            {highRisk ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-critical/45 bg-critical/10 p-4">
                  <p className="flex items-center gap-2 font-display font-semibold text-critical">
                    <Ban className="size-4" aria-hidden /> Transaction blocked
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Reason: high-risk voice score combined with unusual transaction context.
                  </p>
                </div>
                <div className="rounded-xl border border-medium/45 bg-medium/10 p-4">
                  <p className="flex items-center gap-2 font-display font-semibold text-medium">
                    <ShieldAlert className="size-4" aria-hidden /> Secondary verification required
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Complete an OTP or trusted callback before this request can proceed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-safe/45 bg-safe/10 p-4">
                <p className="flex items-center gap-2 font-display font-semibold text-safe">
                  <ShieldCheck className="size-4" aria-hidden /> Call cleared
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Continue normal verification procedures.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="hero"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                  void navigate({ to: "/app/verification" });
                }}
              >
                <UserCheck className="size-4" aria-hidden /> Go to verification
              </Button>
              <Button
                variant="glass"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                  void navigate({ to: "/app/result" });
                }}
              >
                Open full report
              </Button>
              <Button variant="subtle" onClick={reset}>
                Run another scenario
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
