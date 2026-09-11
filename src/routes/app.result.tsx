import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AudioLines, FileQuestion } from "lucide-react";

import { PageHeader } from "@/components/vox/AppShell";
import { ResultView } from "@/components/vox/ResultView";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/result")({
  component: DetectionResult,
});

function DetectionResult() {
  const { latestResult } = useApp();
  const navigate = useNavigate();

  if (!latestResult) {
    return (
      <>
        <PageHeader title="Detection result" description="The most recent voice integrity report appears here." />
        <div className="glass grid place-items-center rounded-2xl px-6 py-20 text-center">
          <FileQuestion className="size-10 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 font-display text-lg font-semibold">No analysis yet</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Record a live sample, upload a recording, or run the guided demo to generate a voice integrity
            report.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button variant="hero" onClick={() => navigate({ to: "/app/live" })}>
              <AudioLines className="size-4" aria-hidden /> Start live detection
            </Button>
            <Button variant="glass" onClick={() => navigate({ to: "/app/analyze" })}>
              Upload a recording
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Detection result"
        description="Full voice integrity report, explainable breakdown and recommended prevention actions."
      />
      <ResultView result={latestResult} callId={latestResult.id} />
    </>
  );
}
