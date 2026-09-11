import { createFileRoute } from "@tanstack/react-router";
import { Gauge, PhoneCall, ShieldAlert, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/vox/AppShell";
import { MetricCard } from "@/components/vox/MetricCard";
import { Pill } from "@/components/vox/RiskBadge";
import {
  CategoryBarChart,
  RiskDistributionChart,
  ThreatsOverTimeChart,
} from "@/components/vox/ThreatChart";
import { Disclaimer } from "@/components/vox/Disclaimer";
import {
  DASHBOARD_METRICS,
  DETECTION_CATEGORIES,
  LANGUAGE_DISTRIBUTION,
  RISK_DISTRIBUTION,
  THREATS_OVER_TIME,
} from "@/lib/demoData";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Voice Threat Analytics — VoxShield AI" },
      {
        name: "description",
        content:
          "Risk distribution, threat trends, detection categories and language coverage across analysed voice traffic.",
      },
      { property: "og:title", content: "Voice Threat Analytics — VoxShield AI" },
      { property: "og:description", content: "Charts covering risk distribution, threat trends and detection categories." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Aggregated detection trends. All charts on this page use sample demo data for the prototype."
        actions={<Pill tone="neutral">Sample analytics</Pill>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Average risk score" value={`${DASHBOARD_METRICS.avgRiskScore}%`} icon={Gauge} />
        <MetricCard label="Calls analysed" value={DASHBOARD_METRICS.callsAnalyzed.toLocaleString("en-IN")} icon={PhoneCall} />
        <MetricCard label="Threats detected" value={DASHBOARD_METRICS.threatsDetected} icon={TriangleAlert} tone="suspicious" />
        <MetricCard label="High risk calls" value={DASHBOARD_METRICS.highRiskCalls} icon={ShieldAlert} tone="critical" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Risk distribution" subtitle="Share of calls per risk band">
          <RiskDistributionChart data={RISK_DISTRIBUTION} />
        </Panel>
        <Panel title="Threats over time" subtitle="Weekly detections vs call volume">
          <ThreatsOverTimeChart data={THREATS_OVER_TIME} />
        </Panel>
        <Panel title="Detection categories" subtitle="What the prototype flagged">
          <CategoryBarChart data={DETECTION_CATEGORIES} dataKey="count" nameKey="category" color="var(--suspicious)" />
        </Panel>
        <Panel title="Language distribution" subtitle="Analysed call volume by language">
          <CategoryBarChart data={LANGUAGE_DISTRIBUTION} dataKey="calls" nameKey="language" />
        </Panel>
      </div>

      <Disclaimer className="mt-6" />
    </>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}
