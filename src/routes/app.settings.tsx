import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/vox/AppShell";
import { LanguageSelector } from "@/components/vox/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Detection Settings — VoxShield AI" },
      {
        name: "description",
        content:
          "Tune risk thresholds, alert channels, verification rules and organisation defaults for voice integrity detection.",
      },
      { property: "og:title", content: "Detection Settings — VoxShield AI" },
      { property: "og:description", content: "Thresholds, alerting and verification policy configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings } = useApp();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Thresholds and rules apply immediately to new analyses in this prototype."
        actions={
          <Button variant="hero" onClick={() => toast.success("Settings saved.")}>
            <Save className="size-4" aria-hidden /> Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Detection settings</h2>
          <div className="mt-5 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <Label>Risk threshold</Label>
                <span className="text-sm font-medium tabular-nums text-primary">{settings.riskThreshold}%</span>
              </div>
              <Slider
                value={[settings.riskThreshold]}
                min={30}
                max={95}
                step={1}
                className="mt-3"
                onValueChange={([value]) => updateSettings({ riskThreshold: value ?? 70 })}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Calls above this score require secondary verification.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>High-risk threshold</Label>
                <span className="text-sm font-medium tabular-nums text-critical">
                  {settings.highRiskThreshold}%
                </span>
              </div>
              <Slider
                value={[settings.highRiskThreshold]}
                min={50}
                max={99}
                step={1}
                className="mt-3"
                onValueChange={([value]) => updateSettings({ highRiskThreshold: value ?? 80 })}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Calls above this score are blocked and escalated automatically.
              </p>
            </div>
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Alert settings</h2>
          <div className="mt-5 space-y-4">
            {(
              [
                ["alertSms", "SMS"],
                ["alertEmail", "Email"],
                ["alertInApp", "In-app notification"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-xl border border-border bg-surface/50 px-4 py-3">
                <span className="text-sm">{label}</span>
                <Switch
                  checked={settings[key]}
                  onCheckedChange={(checked) => updateSettings({ [key]: checked })}
                  aria-label={label}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Verification rules</h2>
          <div className="mt-5 space-y-4">
            {(
              [
                ["requireMfaHighRisk", "Require MFA for high-risk calls"],
                ["requireCallbackHighValue", "Require callback for high-value transactions"],
                ["escalateExecutiveImpersonation", "Escalate high-risk executive impersonation"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={settings[key]}
                  onCheckedChange={(checked) => updateSettings({ [key]: checked === true })}
                  aria-label={label}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-5">
          <h2 className="font-display text-base font-semibold">Organisation settings</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="org">Organisation name</Label>
              <Input
                id="org"
                value={settings.organizationName}
                onChange={(event) => updateSettings({ organizationName: event.target.value })}
                className="mt-1.5 bg-surface/60"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={settings.industry}
                onChange={(event) => updateSettings({ industry: event.target.value })}
                className="mt-1.5 bg-surface/60"
              />
            </div>
            <LanguageSelector
              value={settings.defaultLanguage}
              onChange={(code) => updateSettings({ defaultLanguage: code })}
              label="Default language"
            />
          </div>
        </section>
      </div>
    </>
  );
}
