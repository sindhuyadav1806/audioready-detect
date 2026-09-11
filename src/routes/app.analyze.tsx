import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Waves } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/vox/AppShell";
import { AnalysisTimeline } from "@/components/vox/AnalysisTimeline";
import { AudioUploader, type SelectedAudio } from "@/components/vox/AudioUploader";
import { LanguageNote, LanguageSelector } from "@/components/vox/LanguageSelector";
import { ResultView } from "@/components/vox/ResultView";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import type { LanguageCode, VoiceAnalysisResult } from "@/lib/types";
import { ANALYSIS_STAGES, analyzeVoice } from "@/services/voiceAnalysisService";

export const Route = createFileRoute("/app/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze Voice Recording — VoxShield AI" },
      {
        name: "description",
        content:
          "Upload a WAV, MP3, M4A or WebM recording and receive a layered voice integrity risk report with explainable reasoning.",
      },
      { property: "og:title", content: "Analyze Voice Recording — VoxShield AI" },
      {
        property: "og:description",
        content: "Drag and drop an audio file to run the VoxShield AI six-layer voice integrity pipeline.",
      },
    ],
  }),
  component: AnalyzeAudio,
});

function AnalyzeAudio() {
  const { recordAnalysis, settings } = useApp();
  const [selected, setSelected] = useState<SelectedAudio | null>(null);
  const [language, setLanguage] = useState<LanguageCode>(settings.defaultLanguage);
  const [stage, setStage] = useState(0);
  const [analysing, setAnalysing] = useState(false);
  const [result, setResult] = useState<VoiceAnalysisResult | null>(null);
  const [callId, setCallId] = useState("");

  const analyse = async () => {
    if (!selected) return;
    setAnalysing(true);
    setResult(null);
    setStage(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STAGES.forEach((_, index) => {
      timers.push(setTimeout(() => setStage(index + 1), 520 * (index + 1)));
    });
    try {
      const [analysis] = await Promise.all([
        analyzeVoice(selected.file, {
          source: "upload",
          durationSeconds: Math.max(4, Math.round(selected.file.size / 16000)),
          fileName: selected.file.name,
          language,
        }),
        new Promise((resolve) => setTimeout(resolve, 520 * ANALYSIS_STAGES.length + 250)),
      ]);
      const call = recordAnalysis(analysis, "Uploaded sample");
      setCallId(call.id);
      setResult(analysis);
      toast.success(`Analysis complete — ${analysis.overallRiskScore}% risk`, {
        description: `Report stored as ${call.id}.`,
      });
    } catch {
      toast.error("We could not analyse that file. Try a different recording or format.");
    } finally {
      timers.forEach(clearTimeout);
      setStage(ANALYSIS_STAGES.length);
      setAnalysing(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Analyze Voice Recording"
        description="Upload a call recording or voice note. The prototype extracts deterministic features and returns a layered risk report."
        actions={<LanguageSelector value={language} onChange={setLanguage} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-4">
          <AudioUploader
            selected={selected}
            onSelect={(audio) => {
              setSelected(audio);
              setResult(null);
              setStage(0);
            }}
            onClear={() => {
              setSelected(null);
              setResult(null);
              setStage(0);
            }}
          />
          <Button variant="hero" size="lg" onClick={() => void analyse()} disabled={!selected || analysing}>
            {analysing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Waves className="size-4" aria-hidden />}
            Analyse voice
          </Button>
          {!selected ? (
            <p className="text-sm text-muted-foreground">
              Select a file to enable analysis. Nothing leaves your browser in this prototype.
            </p>
          ) : null}
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Processing stages</h2>
          <div className="mt-4">
            <AnalysisTimeline
              stages={ANALYSIS_STAGES}
              currentStage={analysing ? stage : result ? ANALYSIS_STAGES.length : 0}
            />
          </div>
          {analysing ? (
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${(stage / ANALYSIS_STAGES.length) * 100}%` }}
              />
            </div>
          ) : null}
          <div className="mt-5">
            <LanguageNote />
          </div>
        </section>
      </div>

      {result ? (
        <div className="mt-8">
          <ResultView result={result} callId={callId || result.id} />
        </div>
      ) : (
        <Disclaimer className="mt-6" />
      )}
    </>
  );
}
