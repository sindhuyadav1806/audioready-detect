import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Loader2,
  Mic,
  MicOff,
  Pause,
  PhoneCall,
  PhoneOff,
  Play,
  Radio,
  Square,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/vox/AppShell";
import { AnalysisTimeline } from "@/components/vox/AnalysisTimeline";
import { LanguageNote, LanguageSelector } from "@/components/vox/LanguageSelector";
import { Pill } from "@/components/vox/RiskBadge";
import { ResultView } from "@/components/vox/ResultView";
import { VoiceWaveform } from "@/components/vox/VoiceWaveform";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDuration, useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { SCENARIOS } from "@/lib/demoData";
import { useApp } from "@/lib/store";
import type { LanguageCode, VoiceAnalysisResult } from "@/lib/types";
import { ANALYSIS_STAGES, analyzeVoice } from "@/services/voiceAnalysisService";

export const Route = createFileRoute("/app/live")({
  head: () => ({
    meta: [
      { title: "Real-Time Voice Integrity Detection — VoxShield AI" },
      {
        name: "description",
        content:
          "Record live audio or run a simulated call and watch VoxShield AI score impersonation risk layer by layer.",
      },
      { property: "og:title", content: "Real-Time Voice Integrity Detection — VoxShield AI" },
      {
        property: "og:description",
        content: "Microphone capture, live waveform and layered voice integrity scoring in real time.",
      },
    ],
  }),
  component: LiveDetection,
});

function LiveDetection() {
  const navigate = useNavigate();
  const { recordAnalysis, settings } = useApp();
  const recorder = useVoiceRecorder();

  const [language, setLanguage] = useState<LanguageCode>(settings.defaultLanguage);
  const [analysing, setAnalysing] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [callId, setCallId] = useState("");

  // Simulated live call state
  const scenario = SCENARIOS[0]!;
  const [callActive, setCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [liveLayers, setLiveLayers] = useState<{ label: string; value: number | null }[]>([]);
  const callTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const layerTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearCallTimers = useCallback(() => {
    if (callTimer.current) clearInterval(callTimer.current);
    callTimer.current = null;
    layerTimers.current.forEach(clearTimeout);
    layerTimers.current = [];
  }, []);

  useEffect(() => clearCallTimers, [clearCallTimers]);

  const runAnalysis = useCallback(
    async (
      audio: Blob | string,
      metadata: Parameters<typeof analyzeVoice>[1],
      options?: Parameters<typeof analyzeVoice>[2],
    ) => {
      setAnalysing(true);
      setResult(null);
      setStage(0);
      const timers: ReturnType<typeof setTimeout>[] = [];
      ANALYSIS_STAGES.forEach((_, index) => {
        timers.push(setTimeout(() => setStage(index + 1), 420 * (index + 1)));
      });
      try {
        const [analysis] = await Promise.all([
          analyzeVoice(audio, metadata, options ?? {}),
          new Promise((resolve) => setTimeout(resolve, 420 * ANALYSIS_STAGES.length + 200)),
        ]);
        const call = recordAnalysis(analysis, metadata.context?.caller);
        setCallId(call.id);
        setResult(analysis);
        toast.success(`Analysis complete — ${analysis.overallRiskScore}% risk`, {
          description: `Report stored as ${call.id}.`,
        });
      } catch {
        toast.error("Analysis failed. The inference layer did not respond — please retry.");
      } finally {
        timers.forEach(clearTimeout);
        setStage(ANALYSIS_STAGES.length);
        setAnalysing(false);
      }
    },
    [recordAnalysis],
  );

  const stopAndAnalyse = async () => {
    const recorded = await recorder.stop();
    if (!recorded) {
      toast.error("Nothing was recorded. Please record at least two seconds of speech.");
      return;
    }
    await runAnalysis(recorded.blob, {
      source: "microphone",
      durationSeconds: recorded.durationSeconds || 1,
      language,
    });
  };

  const startSimulatedCall = () => {
    clearCallTimers();
    setResult(null);
    setCallActive(true);
    setCallSeconds(0);
    const labels = [
      "Acoustic score",
      "Spectral score",
      "Prosody score",
      "Speaker consistency",
      "Context score",
    ];
    setLiveLayers(labels.map((label) => ({ label, value: null })));
    callTimer.current = setInterval(() => setCallSeconds((s) => s + 1), 1000);

    const values = [91, 88, 79, 92, 81];
    labels.forEach((_, index) => {
      layerTimers.current.push(
        setTimeout(() => {
          setLiveLayers((prev) =>
            prev.map((layer, i) => (i === index ? { ...layer, value: values[index]! } : layer)),
          );
        }, 1400 * (index + 1)),
      );
    });

    layerTimers.current.push(
      setTimeout(() => {
        clearCallTimers();
        setCallActive(false);
        void runAnalysis(
          `simulated:${scenario.id}`,
          {
            source: "simulated-call",
            durationSeconds: 8,
            language: scenario.language,
            context: scenario.context,
            scenarioId: scenario.id,
          },
          { targetRisk: 87 },
        );
      }, 1400 * labels.length + 900),
    );
  };

  const endCall = () => {
    clearCallTimers();
    setCallActive(false);
    setLiveLayers([]);
    toast.info("Simulated call ended.");
  };

  return (
    <>
      <PageHeader
        title="Real-Time Voice Integrity Detection"
        description="Capture a live microphone sample or replay a simulated inbound call. Both paths run through the same analysis contract."
        actions={<LanguageSelector value={language} onChange={setLanguage} />}
      />

      <Tabs defaultValue="microphone">
        <TabsList>
          <TabsTrigger value="microphone">
            <Mic className="mr-1.5 size-4" aria-hidden /> Microphone
          </TabsTrigger>
          <TabsTrigger value="call">
            <PhoneCall className="mr-1.5 size-4" aria-hidden /> Simulated live call
          </TabsTrigger>
        </TabsList>

        <TabsContent value="microphone" className="mt-5">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      recorder.state === "recording"
                        ? "grid size-9 place-items-center rounded-full bg-critical/20 text-critical animate-pulse-ring"
                        : "grid size-9 place-items-center rounded-full bg-surface-2 text-muted-foreground"
                    }
                  >
                    {recorder.state === "error" ? (
                      <MicOff className="size-4" aria-hidden />
                    ) : (
                      <Mic className="size-4" aria-hidden />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium capitalize">
                      Microphone {recorder.state === "requesting" ? "requesting access" : recorder.state}
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatDuration(recorder.seconds)} recorded
                    </p>
                  </div>
                </div>
                <Pill tone={recorder.state === "recording" ? "critical" : "neutral"}>
                  {recorder.state === "recording" ? "Live" : "Standby"}
                </Pill>
              </div>

              <div className="mt-5">
                <VoiceWaveform
                  analyser={recorder.analyser}
                  active={recorder.state === "recording"}
                  tone={recorder.state === "recording" ? "critical" : "primary"}
                  height={140}
                />
              </div>

              {recorder.state === "recording" ? (
                <p className="mt-3 flex items-center gap-2 text-sm text-primary">
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Analysing voice…
                </p>
              ) : null}

              {recorder.error ? (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-critical/40 bg-critical/10 p-3 text-sm text-critical" role="alert">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>{recorder.error}</span>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                {recorder.state !== "recording" && recorder.state !== "paused" ? (
                  <Button variant="hero" onClick={() => void recorder.start()} disabled={recorder.state === "requesting"}>
                    {recorder.state === "requesting" ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <Mic className="size-4" aria-hidden />
                    )}
                    Start recording
                  </Button>
                ) : null}
                {recorder.state === "recording" ? (
                  <Button variant="glass" onClick={recorder.pause}>
                    <Pause className="size-4" aria-hidden /> Pause
                  </Button>
                ) : null}
                {recorder.state === "paused" ? (
                  <Button variant="glass" onClick={recorder.resume}>
                    <Play className="size-4" aria-hidden /> Resume
                  </Button>
                ) : null}
                {recorder.state === "recording" || recorder.state === "paused" ? (
                  <Button variant="danger" onClick={() => void stopAndAnalyse()}>
                    <Square className="size-4" aria-hidden /> Stop &amp; analyse
                  </Button>
                ) : null}
                {recorder.result ? (
                  <Button variant="subtle" onClick={recorder.reset}>
                    Clear recording
                  </Button>
                ) : null}
              </div>

              {recorder.result ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs tracking-wide uppercase text-muted-foreground">
                    Recorded sample
                  </p>
                  <audio controls src={recorder.result.url} className="w-full" />
                </div>
              ) : null}
            </section>

            <section className="glass rounded-2xl p-5">
              <h2 className="font-display text-base font-semibold">Analysis pipeline</h2>
              <div className="mt-4">
                <AnalysisTimeline stages={ANALYSIS_STAGES} currentStage={analysing ? stage : result ? ANALYSIS_STAGES.length : 0} />
              </div>
              <div className="mt-5 space-y-3">
                <LanguageNote />
                <Button variant="glass" className="w-full" onClick={() => navigate({ to: "/app/analyze" })}>
                  Upload a recording instead
                </Button>
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="call" className="mt-5">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <section className="glass rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">Caller</p>
                  <h2 className="font-display text-lg font-semibold">
                    {callActive ? scenario.caller : "No active call"}
                  </h2>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    Duration {formatDuration(callSeconds)}
                  </p>
                </div>
                <Pill tone={callActive ? "critical" : "neutral"}>
                  <Radio className="size-3" aria-hidden /> {callActive ? "Analysing…" : "Idle"}
                </Pill>
              </div>

              <div className="mt-5">
                <VoiceWaveform active={callActive} tone={callActive ? "suspicious" : "primary"} height={140} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {liveLayers.map((layer) => (
                  <div key={layer.label} className="rounded-xl border border-border bg-surface/50 p-3">
                    <p className="text-xs tracking-wide uppercase text-muted-foreground">{layer.label}</p>
                    <p className="mt-1 font-display text-xl font-semibold tabular-nums">
                      {layer.value === null ? (
                        <span className="text-sm text-muted-foreground">Analysing…</span>
                      ) : (
                        `${layer.value}%`
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="hero" onClick={startSimulatedCall} disabled={callActive || analysing}>
                  <PhoneCall className="size-4" aria-hidden /> Start simulated call
                </Button>
                {callActive ? (
                  <Button variant="danger" onClick={endCall}>
                    <PhoneOff className="size-4" aria-hidden /> End call
                  </Button>
                ) : null}
              </div>
            </section>

            <section className="glass rounded-2xl p-5">
              <h2 className="font-display text-base font-semibold">Detection status</h2>
              <div className="mt-4">
                <AnalysisTimeline stages={ANALYSIS_STAGES} currentStage={analysing ? stage : result ? ANALYSIS_STAGES.length : 0} />
              </div>
              <Disclaimer compact className="mt-5" />
            </section>
          </div>
        </TabsContent>
      </Tabs>

      {analysing ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-primary">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Running the six-layer analysis…
        </p>
      ) : null}

      {result ? (
        <div className="mt-8">
          <ResultView result={result} callId={callId || result.id} />
        </div>
      ) : null}
    </>
  );
}
