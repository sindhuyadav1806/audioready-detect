import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BellOff, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/vox/AppShell";
import { ThreatAlert } from "@/components/vox/ThreatAlert";
import { Disclaimer } from "@/components/vox/Disclaimer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({
    meta: [
      { title: "Security Alerts — VoxShield AI" },
      {
        name: "description",
        content:
          "Triage voice impersonation alerts: mark as read, resolve or escalate high-risk detections to a supervisor.",
      },
      { property: "og:title", content: "Security Alerts — VoxShield AI" },
      { property: "og:description", content: "Alert triage queue for voice cloning and impersonation detections." },
    ],
  }),
  component: Alerts,
});

function Alerts() {
  const { alerts, markAlertRead, markAllAlertsRead, setAlertState } = useApp();
  const [filter, setFilter] = useState("all");

  const visible = alerts.filter((alert) => {
    if (filter === "unread") return !alert.read;
    if (filter === "open") return alert.state === "open";
    if (filter === "resolved") return alert.state === "resolved";
    if (filter === "escalated") return alert.state === "escalated";
    return true;
  });

  return (
    <>
      <PageHeader
        title="Security Alerts"
        description="Every detection above the configured risk threshold raises an alert for analyst triage."
        actions={
          <Button variant="glass" onClick={() => markAllAlertsRead()}>
            <CheckCheck className="size-4" aria-hidden /> Mark all as read
          </Button>
        }
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-5 space-y-4">
        {visible.length === 0 ? (
          <div className="glass grid place-items-center rounded-2xl px-6 py-16 text-center">
            <BellOff className="size-9 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-display text-lg font-semibold">Nothing in this queue</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Alerts appear here as soon as a call scores above the risk threshold.
            </p>
          </div>
        ) : (
          visible.map((alert) => (
            <ThreatAlert
              key={alert.id}
              alert={alert}
              onRead={() => markAlertRead(alert.id)}
              onResolve={() => {
                setAlertState(alert.id, "resolved");
                toast.success(`${alert.id} resolved.`);
              }}
              onEscalate={() => {
                setAlertState(alert.id, "escalated");
                toast.success(`${alert.id} escalated to a supervisor.`);
              }}
            />
          ))
        )}
      </div>

      <Disclaimer className="mt-6" compact />
    </>
  );
}
