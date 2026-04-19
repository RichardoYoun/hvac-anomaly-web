"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { UnitSummary } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { cn, formatKwh, formatPct } from "@/lib/utils";

interface UnitsTableProps {
  units: UnitSummary[];
  loading: boolean;
  selectedUnitId: string | null;
  onSelect: (id: string) => void;
}

function TrendIcon({ trend }: { trend: UnitSummary["trend"] }) {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-1 text-red-400">
        <TrendingUp className="h-3.5 w-3.5" />
        <span className="text-xs">up</span>
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400">
        <TrendingDown className="h-3.5 w-3.5" />
        <span className="text-xs">down</span>
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-zinc-500">
      <Minus className="h-3.5 w-3.5" />
      <span className="text-xs">flat</span>
    </span>
  );
}

const rowTone = (status: UnitSummary["latestScore"]["status"]) => {
  switch (status) {
    case "critical":
      return "hover:bg-red-500/5";
    case "warning":
      return "hover:bg-amber-500/5";
    default:
      return "hover:bg-zinc-900/60";
  }
};

const leftStripe = (status: UnitSummary["latestScore"]["status"]) => {
  switch (status) {
    case "critical":
      return "bg-red-500";
    case "warning":
      return "bg-amber-400";
    default:
      return "bg-transparent";
  }
};

export function UnitsTable({
  units,
  loading,
  selectedUnitId,
  onSelect,
}: UnitsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50 backdrop-blur">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-1" />
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Unit
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Suite
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              AC #
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Current
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Baseline
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Deviation
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Trend
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Alerts 24h
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Status
            </TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-zinc-800">
                  <TableCell colSpan={11}>
                    <Skeleton className="h-6 w-full bg-zinc-800" />
                  </TableCell>
                </TableRow>
              ))
            : units.map((u) => {
                const { unit, latestScore, trend, alertCount24h } = u;
                const isSelected = selectedUnitId === unit.id;
                return (
                  <TableRow
                    key={unit.id}
                    onClick={() => onSelect(unit.id)}
                    className={cn(
                      "relative cursor-pointer border-zinc-800 transition-colors",
                      rowTone(latestScore.status),
                      isSelected && "bg-indigo-500/10 hover:bg-indigo-500/15"
                    )}
                  >
                    <TableCell className="relative p-0">
                      <span
                        className={cn(
                          "absolute inset-y-0 left-0 w-0.5",
                          leftStripe(latestScore.status)
                        )}
                      />
                      <div className="flex items-center justify-center pl-2">
                        {latestScore.status === "critical" && (
                          <span className="relative inline-flex h-2 w-2">
                            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-zinc-100">
                      {unit.label}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      Suite {unit.suite}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      AC #{unit.acNumber}
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums text-zinc-100">
                      {formatKwh(latestScore.actualKwh)}
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums text-zinc-500">
                      {formatKwh(latestScore.baselineKwh)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-mono text-sm font-semibold tabular-nums",
                        latestScore.pctDeviation > 30
                          ? "text-red-400"
                          : latestScore.pctDeviation > 15
                            ? "text-amber-400"
                            : "text-emerald-400"
                      )}
                    >
                      {formatPct(latestScore.pctDeviation)}
                    </TableCell>
                    <TableCell>
                      <TrendIcon trend={trend} />
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums text-zinc-400">
                      {alertCount24h}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={latestScore.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-zinc-600 transition",
                          isSelected && "translate-x-0.5 text-indigo-400"
                        )}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
