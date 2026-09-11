import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Eye, EyeOff, KeyRound, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/vox/AppShell";
import { Pill } from "@/components/vox/RiskBadge";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/config";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/api")({
  head: () => ({
    meta: [
      { title: "VoxShield API & Integration — VoxShield AI" },
      {
        name: "description",
        content:
          "Endpoints, request and response contracts and API key management for integrating voice integrity analysis into your call stack.",
      },
      { property: "og:title", content: "VoxShield API & Integration — VoxShield AI" },
      { property: "og:description", content: "Developer reference for the VoxShield voice integrity API." },
    ],
  }),
  component: ApiIntegration;
});

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/v1/analyze-voice",
    description: "Analyse a complete audio sample and return a layered risk report.",
  },
  {
    method: "POST",
    path: "/api/v1/analyze-stream",
    description: "Stream PCM frames for continuous in-call scoring.",
  },
  {
    method: "POST",
    path: "/api/v1/verify-speaker",
    description: "Compare a sample against an enrolled speaker profile.",
  },
  { method: "GET", path: "/api/v1/risk/{callId}", description: "Fetch the stored risk report for a call." },
  { method: "GET", path: "/api/v1/alerts", description: "List open security alerts for the organisation." },
];

const REQUEST_SAMPLE = `curl -X POST ${API_BASE_URL}/analyze-voice \\
  -H "Authorization: Bearer $VOXSHIELD_API_KEY" \\
  -F "audio=@call-90411.wav" \\
  -F 'metadata={"caller_id":"+919400071190","language":"en","transaction_amount":850000}'`;

const RESPONSE_SAMPLE = `{
  "risk_score": 87,
  "classification": "HIGH_RISK",
  "voice_type": "POSSIBLE_SYNTHETIC",
  "language": "en",
  "confidence": 0.91,
  "recommended_action": "SECONDARY_VERIFICATION"
}`;

function ApiIntegration() {
  const { apiKey, setApiKey } = useApp();
  const [revealed, setRevealed] = useState(false);

  const generate = () => {
    const key = `vx_live_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
    setApiKey(key);
    setRevealed(true);
    toast.success("API key generated.", { description: "Simulated key for the prototype only." });
  };

  const masked = apiKey ? `${apiKey.slice(0, 11)}${"•".repeat(12)}${apiKey.slice(-4)}` : null;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard.`);
    } catch {
      toast.error("Clipboard access was blocked by the browser.");
    }
  };

  return (
    <>
      <PageHeader
        title="VoxShield API"
        description="Integrate voice integrity scoring into contact-centre, IVR or banking workflows. Endpoints below describe the target contract implemented by the mock inference layer."
        actions={<Pill tone="neutral">Base URL {API_BASE_URL}</Pill>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Endpoints</h2>
          <ul className="mt-4 space-y-3">
            {ENDPOINTS.map((endpoint) => (
              <li key={endpoint.path} className="rounded-xl border border-border bg-surface/50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone={endpoint.method === "POST" ? "medium" : "safe"}>{endpoint.method}</Pill>
                  <code className="font-mono text-sm text-primary">{endpoint.path}</code>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">{endpoint.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <KeyRound className="size-4 text-primary" aria-hidden /> API key
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Keys are simulated in this prototype and never leave the browser.
          </p>
          <div className="mt-4 rounded-xl border border-border bg-background/60 p-3 font-mono text-sm break-all">
            {apiKey ? (revealed ? apiKey : masked) : "No key generated yet"}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="hero" onClick={generate}>
              <RefreshCw className="size-4" aria-hidden /> {apiKey ? "Rotate key" : "Generate API key"}
            </Button>
            {apiKey ? (
              <>
                <Button variant="glass" onClick={() => setRevealed((value) => !value)}>
                  {revealed ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                  {revealed ? "Hide" : "Reveal"}
                </Button>
                <Button variant="subtle" onClick={() => void copy(apiKey, "API key")}>
                  <Copy className="size-4" aria-hidden /> Copy
                </Button>
              </>
            ) : null}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CodeBlock title="Example request" code={REQUEST_SAMPLE} onCopy={() => void copy(REQUEST_SAMPLE, "Request")} />
        <CodeBlock title="Example response" code={RESPONSE_SAMPLE} onCopy={() => void copy(RESPONSE_SAMPLE, "Response")} />
      </div>

      <p className="mt-6 rounded-xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted-foreground">
        The frontend calls a single seam — <code className="font-mono text-primary">analyzeVoice()</code> — so
        pointing <code className="font-mono text-primary">VITE_API_BASE_URL</code> at a FastAPI or
        TorchServe deployment and setting{" "}
        <code className="font-mono text-primary">VITE_USE_MOCK_INFERENCE=false</code> switches the whole
        product onto a real model without UI changes.
      </p>
    </>
  );
}

function CodeBlock({ title, code, onCopy }: { title: string; code: string; onCopy: () => void }) {
  return (
    <section className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold">{title}</h2>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          <Copy className="size-3.5" aria-hidden /> Copy
        </Button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-border bg-background/70 p-4 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </section>
  );
}
