import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

import { AppShell } from "@/components/vox/AppShell";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Voice Security Command Center — VoxShield AI" },
      {
        name: "description",
        content:
          "Monitor voice cloning threats, analyse recordings and run verification workflows from the VoxShield AI security console.",
      },
      { property: "og:title", content: "Voice Security Command Center — VoxShield AI" },
      {
        property: "og:description",
        content: "Real-time voice integrity monitoring, risk scoring and fraud prevention workflows.",
      },
    ],
  }),
  component: AppLayout,
});

function AppLayout() {
  const { hydrated, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !user) void navigate({ to: "/auth", replace: true });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Restoring secure session…
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
