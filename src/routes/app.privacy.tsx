import { createFileRoute } from "@tanstack/react-router";
import { Cpu, FileLock2, Lock, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/vox/AppShell";
import { Pill } from "@/components/vox/RiskBadge";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Compliance — VoxShield AI" },
      {
        name: "description",
        content:
          "Control audio retention, feature-only logging, edge inference and encryption for voice integrity analysis.",
      },
      { property: "og:title", content: "Privacy & Compliance — VoxShield AI" },
      { property: "og:description", content: "Privacy controls for voice data: retention, logging and edge processing." },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const { settings, updateSettings } = useApp();

  const toggles = [
    {
      key: "minimalRetention" as const,
      icon: FileLock2,
      title: "Audio retention",
      label: "Minimal retention",
      description: "Discard raw audio after analysis; keep only the risk record and derived features.",
    },
    {
      key: "featureOnlyLogging" as const,
      icon: Lock,
      title: "Feature-only logging",
      label: "Enabled",
      description: "Persist numeric feature vectors and scores instead of listenable audio.",
    },
    {
      key: "edgeProcessing" as const,
      icon: Cpu,
      title: "On-device / edge processing",
      label: "Enabled",
      description: "Run inference at the edge so speech never leaves the customer's network boundary.",
    },
  ];

  return (
    <>
      <PageHeader
        title="Privacy & Compliance"
        description="Voice is biometric data. These controls define how little of it the platform keeps."
        actions={<Pill tone="safe">Audio encryption: active</Pill>}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          {toggles.map((item) => (
            <div key={item.key} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <item.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-[200px] flex-1">
                <p className="font-display font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
              <label className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Switch
                  checked={settings[item.key]}
                  onCheckedChange={(checked) => {
                    updateSettings({ [item.key]: checked });
                    toast.success(`${item.title} ${checked ? "enabled" : "disabled"}.`);
                  }}
                  aria-label={item.title}
                />
              </label>
            </div>
          ))}

          <div className="glass rounded-2xl p-5">
            <p className="flex items-center gap-2 font-display font-semibold">
              <Lock className="size-4 text-safe" aria-hidden /> Audio encryption
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Samples in transit and at rest are encrypted in the reference architecture (TLS 1.3 in
              transit, AES-256 at rest). Status shown here is the intended production posture.
            </p>
            <Pill tone="safe" className="mt-3">
              Active
            </Pill>
          </div>
        </section>

        <div className="space-y-6">
          <section className="glass rounded-2xl p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <Users className="size-4 text-primary" aria-hidden /> Data access
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {["Security Team", "Administrator", "Authorized Investigators"].map((role) => (
                <li key={role} className="flex items-center justify-between rounded-xl border border-border bg-surface/50 px-3 py-2">
                  <span>{role}</span>
                  <Pill tone="neutral">Least privilege</Pill>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-2xl p-5">
            <h2 className="font-display text-base font-semibold">Privacy principle</h2>
            <p className="mt-2 text-sm leading-relaxed">
              “Store only what is necessary for detection, investigation and security auditing.”
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              This prototype does not claim compliance with any specific legal framework. A production
              deployment requires an independent privacy review, a documented retention policy and lawful
              basis for processing voice biometrics.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
