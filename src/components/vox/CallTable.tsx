import { ArrowRight } from "lucide-react";

import type { CallRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RiskBadge, StatusPill } from "./RiskBadge";
import { languageLabel } from "./LanguageSelector";
import { voiceTypeLabel } from "@/services/riskScoringService";

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function CallTable({
  calls,
  onSelect,
  showDate = false,
  emptyMessage = "No calls match the current filters.",
}: {
  calls: CallRecord[];
  onSelect: (call: CallRecord) => void;
  showDate?: boolean | undefined;
  emptyMessage?: string | undefined;
}) {
  if (calls.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Caller</TableHead>
            <TableHead>{showDate ? "Date" : "Time"}</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Voice type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call) => (
            <TableRow
              key={call.id}
              className="cursor-pointer"
              onClick={() => onSelect(call)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSelect(call);
              }}
            >
              <TableCell>
                <span className="font-medium">{call.caller}</span>
                <span className="block text-xs text-muted-foreground">{call.id}</span>
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {showDate ? formatDateTime(call.timestamp) : formatTime(call.timestamp)}
              </TableCell>
              <TableCell className="text-muted-foreground">{languageLabel(call.language)}</TableCell>
              <TableCell>
                <RiskBadge classification={call.classification} score={call.riskScore} />
              </TableCell>
              <TableCell className="text-muted-foreground">{voiceTypeLabel(call.voiceType)}</TableCell>
              <TableCell>
                <StatusPill status={call.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(call);
                  }}
                >
                  Review <ArrowRight className="size-3.5" aria-hidden />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
