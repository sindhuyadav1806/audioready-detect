import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AudioLines,
  Banknote,
  BrainCircuit,
  Building2,
  Cpu,
  Fingerprint,
  Gauge,
  Headphones,
  Landmark,
  Lock,
  Play,
  Radar,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Sparkles,
  Waves,
} from "lucide-react";

import heroImage from "@/assets/hero-voice-analysis.jpg";
import { Button } from "@/components/ui/button";
import { DemoAttackSimulation } from "@/components/vox/DemoAttackSimulation";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { Pill } from "@/components/vox/RiskBadge";
import { RiskGauge } from "@/components/vox/RiskGauge";
import { VoiceWaveform } from "@/components/vox/VoiceWaveform";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoxShield AI — Real-Time Voice Cloning Detection" },
      {
        name: "description",
        content:
          "VoxShield AI analyses voice characteristics, speech patterns and contextual signals to flag potential AI-generated or cloned voices in real time.",
      },
      { property: "og:title", content: "VoxShield AI — Real-Time Voice Cloning Detection" },
      {
        property: "og:description",
        content:
          "Detect AI-generated voices before they become real-world threats: layered voice integrity analysis, risk scoring and fraud prevention workflows.",
      },
    ],
  }),
  component: Landing,
});

const DETECTION_LAYERS = [
  {
    icon: AudioLines,
    title: "Acoustic Analysis",
    body: "Formant structure, jitter, shimmer and micro-timing features that differ between organic and generated speech.",
  },
  {
    icon: Waves,
    title: "Spectral Analysis",
    body: "High-frequency energy, vocoder artefacts and spectral smoothness typical of neural synthesis pipelines.",
  },
  {
    icon: Activity,
    title: "Prosody Analysis",
    body: "Pitch contour, stress placement and rhythm variability that synthetic voices often over-regularise.",
  },
  {
    icon: BrainCircuit,
    title: "Behavioural Analysis",
    body: "Pause distribution, turn-taking and hesitation patterns compared against historic caller behaviour.",
  },
  {
    icon: Fingerprint,
    title: "Speaker Consistency",
    body: "Speaker embedding drift across the sample, checked against the enrolled voice profile.",
  },
  {
    icon: Radar,
    title: "Contextual Risk",
    body: "Transaction value, caller history, time of day and fraud indicators fused into the final score.",
  },
];

const STEPS = [
  { icon: Radio, title: "Capture Voice", body: "Microphone, call stream or uploaded recording." },
  { icon: Waves, title: "Analyze Voice", body: "Six detection layers run over the same feature set." },
  { icon: Gauge, title: "Calculate Risk", body: "Layers plus context fuse into one 0–100 risk score." },
  { icon: ShieldCheck, title: "Prevent Fraud", body: "Block, call back, request MFA or escalate." },
];

const USE_CASES = [
  { icon: Landmark, title: "Banking", body: "Beneficiary changes and high-value transfers over the phone." },
  { icon: Building2, title: "Enterprise", body: "Executive impersonation and vendor payment fraud." },
  { icon: ShieldCheck, title: "Government", body: "Officials impersonated to pressure citizens or staff." },
  { icon: Signal, title: "Telecom", body: "SIM swap and account recovery abuse via voice channels." },
  { icon: Headphones, title: "Call Centres", body: "Agent-assist risk cues during live customer calls." },
  { icon: Banknote, title: "High-value Transactions", body: "Secondary verification for irreversible payments." },
];

function Landing() {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="pointer-events-none fixed inset-0 aurora opacity-70" aria-hidden />
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block font-display text-base font-bold leading-tight">VoxShield AI</span>
            <span className="block text-[0.62rem] tracking-[0.16em] uppercase text-muted-foreground">
              Voice Integrity
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#why" className="transition-colors hover:text-foreground">
            Why it matters
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#layers" className="transition-colors hover:text-foreground">
            Detection layers
          </a>
          <a href="#privacy" className="transition-colors hover:text-foreground">
            Privacy
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/auth" })}>
            Sign in
          </Button>
          <Button variant="hero" size="sm" onClick={() => navigate({ to: "/auth" })}>
            Start detection
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <div className="rise-in">
          <Pill tone="medium">
            <Sparkles className="size-3" aria-hidden /> SIH 2026 · Problem statement SIH26104
          </Pill>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            Stop voice cloning attacks{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent glow-text">
              before they cause damage
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            VoxShield AI analyses voice characteristics, speech patterns and contextual signals to
            identify potential AI-generated or cloned voices in real time.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate({ to: "/auth" })}>
              <ShieldCheck className="size-4" aria-hidden /> Start detection
            </Button>
            <Button variant="glass" size="lg" onClick={() => setDemoOpen(true)}>
              <Play className="size-4" aria-hidden /> View demo
            </Button>
          </div>
          <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4">
            {[
              ["6", "Detection layers"],
              ["8", "Indian languages"],
              ["<2s", "Scoring latency target"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-bold text-primary">{value}</dt>
                <dd className="text-xs text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="glass rise-in relative overflow-hidden rounded-3xl p-4">
          <img
            src={heroImage}
            alt="Voice integrity analysis console showing a scanned audio waveform, spectral heatmap and risk gauge"
            width={1408}
            height={1024}
            className="rounded-2xl opacity-80"
          />
          <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-primary/30 bg-background/85 p-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-xs tracking-[0.16em] uppercase text-muted-foreground">
                  <ShieldAlert className="size-3.5 text-critical" aria-hidden /> Potential threat detected
                </p>
                <div className="mt-3">
                  <VoiceWaveform height={54} tone="critical" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Unknown caller · fund transfer request · unusual hour
                </p>
              </div>
              <RiskGauge score={87} size={104} />
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="glass rounded-3xl p-8">
          <h2 className="font-display text-3xl font-bold">Why voice security matters</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Generative AI now produces high-fidelity voice clones from seconds of reference audio.
            Attackers use those clones to impersonate executives, government officials, bank customers
            and trusted family members — and phone calls still authorise some of the most sensitive
            actions in banking, enterprise finance and public administration. Caller ID and a familiar
            voice are no longer evidence of identity.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Seconds of audio", "is enough reference material for a convincing clone."],
              ["Voice authorises money", "transfers, beneficiary changes and account recovery."],
              ["Humans can't hear it", "modern synthesis artefacts sit outside conscious perception."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-border bg-surface/50 p-4">
                <p className="font-display font-semibold text-primary">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="font-display text-3xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <step.icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs tracking-[0.16em] uppercase text-muted-foreground">
                Step {index + 1}
              </p>
              <p className="mt-1 font-display text-lg font-semibold">{step.title}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Layers */}
      <section id="layers" className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Detection layers</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Each layer produces an independent suspicion score. The platform fuses them with contextual
          risk so no single signal can trigger a decision on its own.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DETECTION_LAYERS.map((layer) => (
            <article key={layer.title} className="glass rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <span className="grid size-10 place-items-center rounded-xl bg-accent/20 text-primary">
                <layer.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{layer.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{layer.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="font-display text-3xl font-bold">Use cases</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-surface/50 p-5">
              <item.icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-3 font-display font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="glass rounded-3xl p-8">
          <h2 className="font-display text-3xl font-bold">Privacy first</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Lock, "Minimal audio retention", "Raw audio is discarded once features are extracted."],
              [Activity, "Feature-only logging", "Numeric features and scores are stored, not listenable speech."],
              [Cpu, "Edge inference ready", "Architecture supports on-device or in-network scoring."],
              [ShieldCheck, "Secure processing", "Encryption in transit and at rest, least-privilege access."],
            ].map(([Icon, title, body]) => {
              const Component = Icon as typeof Lock;
              return (
                <div key={title as string} className="rounded-2xl border border-border bg-surface/50 p-5">
                  <Component className="size-5 text-safe" aria-hidden />
                  <h3 className="mt-3 font-display font-semibold">{title as string}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{body as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="glass flex flex-wrap items-center justify-between gap-6 rounded-3xl p-8">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Detect AI-generated voices before they become real-world threats.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Open the console with the demo account and run a complete CEO voice-cloning attack
              simulation end to end.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate({ to: "/auth" })}>
              Start detection
            </Button>
            <Button variant="glass" size="lg" onClick={() => setDemoOpen(true)}>
              <Play className="size-4" aria-hidden /> View demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <Disclaimer />
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} VoxShield AI · Prototype for Smart India Hackathon 2026
          (SIH26104), theme Blockchain &amp; Cybersecurity.
        </p>
      </footer>

      <DemoAttackSimulation open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
