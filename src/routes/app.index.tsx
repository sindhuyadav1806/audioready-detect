import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AudioLines, Gauge, PhoneCall, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/vox/AppShell";
import { CallTable } from "@/components/vox/CallTable";
import { DemoAttackSimulation } from "@/components/vox/DemoAttackSimulation";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { MetricCard } from "@/components/vox/MetricCard";
import { Pill } from "@/components/vox/RiskBadge";
import { ThreatChart } from "@/components/vox/ThreatChart";
import { Button } from "@/components/ui/button";
import { THREAT_TIMELINE } from "@/lib/demoData";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  component: Overview,
});

function Overview() {
  const { calls, metrics, alerts } = useApp();
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  const openAlerts = alerts.filter((alert) => alert.state === "open").length;

  return (
    <>
      <PageHeader
        title="Voice Security Command Center"
        description="Live voice integrity posture across every monitored channel. All figures in this prototype are simulated demo data."
        actions={
          <>
            <Button variant="glass" onClick={() => navigate({ to: "/app/live" })}>
              <AudioLines className="size-4" aria-hidden /> Live detection
            </Button>
            <Button variant="hero" onClick={() => setDemoOpen(true)}>
              <Sparkles className="size-4" aria-hidden /> Run demo attack
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Calls analysed" value={metrics.callsAnalyzed.toLocaleString("en-IN")} icon={PhoneCall} hint="Last 30 days" />
        <MetricCard
          label="Threats detected"
          value={metrics.threatsDetected}
          icon={TriangleAlert}
          tone="suspicious"
          hint={`${openAlerts} alerts still open`}
        />
        <MetricCard label="High risk calls" value={metrics.highRiskCalls} icon={ShieldAlert} tone="critical" hint="Blocked or escalated" />
        <MetricCard
          label="Detection accuracy"
          value={`${metrics.detectionAccuracy}%`}
          icon={Gauge}
          tone="safe"
          hint="Prototype / simulated metric — not validated"
        />
      </div>

      <section className="glass mt-6 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">Live threat overview</h2>
            <p className="text-sm text-muted-foreground">Call classification across the last 24 hours</p>
          </div>
          <Pill tone="neutral">Simulated data</Pill>
        </div>
        <div className="mt-5">
          <ThreatChart data={THREAT_TIMELINE} />
        </div>
      </section>

      <section className="glass mt-6 rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Recent calls</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/app/history" })}>
            View full history
          </Button>
        </div>
        <div className="mt-4">
          <CallTable calls={calls.slice(0, 6)} onSelect={() => navigate({ to: "/app/history" })} />
        </div>
      </section>

      <Disclaimer className="mt-6" />
      <DemoAttackSimulation open={demoOpen} onOpenChange={setDemoOpen} />
    </>
  );
}
