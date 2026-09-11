import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { PageHeader } from "@/components/vox/AppShell";
import { CallTable, formatDateTime } from "@/components/vox/CallTable";
import { DetectionBreakdown } from "@/components/vox/DetectionBreakdown";
import { RiskGauge } from "@/components/vox/RiskGauge";
import { RiskBadge } from "@/components/vox/RiskBadge";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { languageLabel } from "@/components/vox/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, type CallRecord } from "@/lib/types";
import { useApp } from "@/lib/store";
import { voiceTypeLabel } from "@/services/riskScoringService";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "Voice Threat History — VoxShield AI" },
      {
        name: "description",
        content:
          "Search and filter every analysed call with risk score, detection type, language and the action taken.",
      },
      { property: "og:title", content: "Voice Threat History — VoxShield AI" },
      { property: "og:description", content: "Full audit trail of analysed calls and voice threat detections." },
    ],
  }),
  component: History,
});

function History() {
  const { calls, resultForCall } = useApp();
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("all");
  const [language, setLanguage] = useState("all");
  const [range, setRange] = useState("all");
  const [detection, setDetection] = useState("all");
  const [selected, setSelected] = useState<CallRecord | null>(null);

  const detections = useMemo(
    () => Array.from(new Set(calls.map((call) => call.detection))),
    [calls],
  );

  const filtered = useMemo(() => {
    const now = Date.now();
    return calls.filter((call) => {
      if (query) {
        const haystack = `${call.caller} ${call.id} ${call.callerId}`.toLowerCase();
        if (!haystack.includes(query.toLowerCase())) return false;
      }
      if (risk !== "all" && call.classification !== risk) return false;
      if (language !== "all" && call.language !== language) return false;
      if (detection !== "all" && call.detection !== detection) return false;
      if (range !== "all") {
        const days = Number(range);
        if (now - new Date(call.timestamp).getTime() > days * 86400000) return false;
      }
      return true;
    });
  }, [calls, query, risk, language, detection, range]);

  const result = selected ? resultForCall(selected.id) : undefined;

  return (
    <>
      <PageHeader
        title="Voice Threat History"
        description="Every analysed call with its risk score, detection type and the action that was taken."
      />

      <section className="glass rounded-2xl p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search caller or call ID"
              className="bg-surface/60 pl-9"
              aria-label="Search calls"
            />
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="bg-surface/60" aria-label="Date range">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="3">Last 3 days</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger className="bg-surface/60" aria-label="Risk level">
              <SelectValue placeholder="Risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              <SelectItem value="LOW_RISK">Low risk</SelectItem>
              <SelectItem value="MEDIUM_RISK">Medium risk</SelectItem>
              <SelectItem value="SUSPICIOUS">Suspicious</SelectItem>
              <SelectItem value="HIGH_RISK">High risk</SelectItem>
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-surface/60" aria-label="Language">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All languages</SelectItem>
              {LANGUAGES.map((option) => (
                <SelectItem key={option.code} value={option.code}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={detection} onValueChange={setDetection}>
            <SelectTrigger className="bg-surface/60" aria-label="Detection type">
              <SelectValue placeholder="Detection type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All detections</SelectItem>
              {detections.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {calls.length} calls
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setRisk("all");
              setLanguage("all");
              setRange("all");
              setDetection("all");
            }}
          >
            Reset filters
          </Button>
        </div>

        <div className="mt-2">
          <CallTable calls={filtered} onSelect={setSelected} showDate />
        </div>
      </section>

      <Disclaimer className="mt-6" compact />

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {selected?.caller} · {selected?.id}
            </DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <RiskGauge score={selected.riskScore} size={160} />
                <dl className="flex-1 space-y-2 text-sm">
                  <Row label="Caller ID" value={selected.callerId} />
                  <Row label="Timestamp" value={formatDateTime(selected.timestamp)} />
                  <Row label="Language" value={languageLabel(selected.language)} />
                  <Row label="Voice type" value={voiceTypeLabel(selected.voiceType)} />
                  <Row label="Detection" value={selected.detection} />
                  <Row label="Action taken" value={selected.action} />
                </dl>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <RiskBadge classification={selected.classification} score={selected.riskScore} />
              </div>
              {result ? (
                <DetectionBreakdown result={result} />
              ) : (
                <p className="rounded-xl border border-border bg-surface/50 p-4 text-sm text-muted-foreground">
                  Layer-level features for this historic call were not retained. Under minimal-retention
                  policy only the summary risk record is stored beyond the investigation window.
                </p>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5">
      <dt className="text-xs tracking-wide uppercase text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
