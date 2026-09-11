import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, TriangleAlert } from "lucide-react";

import { PageHeader } from "@/components/vox/AppShell";
import { AuditChainTable, AuditChainVisual } from "@/components/vox/AuditChain";
import { Pill } from "@/components/vox/RiskBadge";
import { useApp } from "@/lib/store";
import { verifyChain } from "@/services/auditService";

export const Route = createFileRoute("/app/audit")({
  head: () => ({
    meta: [
      { title: "Tamper-Evident Security Audit — VoxShield AI" },
      {
        name: "description",
        content:
          "Hash-chained audit ledger of every voice analysis, block and verification event, ready to anchor to a permissioned blockchain.",
      },
      { property: "og:title", content: "Tamper-Evident Security Audit — VoxShield AI" },
      { property: "og:description", content: "Hash-linked prototype audit ledger for voice security events." },
    ],
  }),
  component: Audit,
});

function Audit() {
  const { audit } = useApp();
  const brokenIndex = verifyChain(audit);
  const intact = brokenIndex === -1;

  return (
    <>
      <PageHeader
        title="Tamper-Evident Security Audit"
        description="Each event stores the hash of its own payload plus the previous event's hash, so any edit breaks the chain."
        actions={
          intact ? (
            <Pill tone="safe">
              <ShieldCheck className="size-3.5" aria-hidden /> Chain verified · {audit.length} events
            </Pill>
          ) : (
            <Pill tone="critical">
              <TriangleAlert className="size-3.5" aria-hidden /> Chain broken at event {brokenIndex + 1}
            </Pill>
          )
        }
      />

      <section className="glass rounded-2xl p-5">
        <h2 className="font-display text-base font-semibold">Chain visualisation</h2>
        <p className="text-sm text-muted-foreground">Most recent five events, oldest to newest</p>
        <div className="mt-4">
          <AuditChainVisual events={audit} />
        </div>
      </section>

      <section className="glass mt-6 rounded-2xl p-5">
        <h2 className="font-display text-base font-semibold">Audit ledger</h2>
        <div className="mt-4">
          <AuditChainTable events={audit} />
        </div>
      </section>

      <p className="mt-6 rounded-xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted-foreground">
        Prototype tamper-evident audit ledger. Hashes are computed in the browser and stored locally for
        the demo. A production implementation can anchor these records to a permissioned blockchain or a
        write-once ledger service — no blockchain is implemented here.
      </p>
    </>
  );
}
