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
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { UnitSummary } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { cn, rowBgClass, formatKwh, formatPct } from "@/lib/utils";

interface UnitsTableProps {
  units: UnitSummary[];
  loading: boolean;
  selectedUnitId: string | null;
  onSelect: (id: string) => void;
}

function TrendIcon({ trend }: { trend: UnitSummary["trend"] }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-400 inline ml-1" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-green-400 inline ml-1" />;
  return <Minus className="h-4 w-4 text-zinc-500 inline ml-1" />;
}

export function UnitsTable({ units, loading, selectedUnitId, onSelect }: UnitsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400 w-8"></TableHead>
            <TableHead className="text-zinc-400">Unit</TableHead>
            <TableHead className="text-zinc-400">Suite</TableHead>
            <TableHead className="text-zinc-400">AC #</TableHead>
            <TableHead className="text-zinc-400">Current Draw</TableHead>
            <TableHead className="text-zinc-400">Baseline</TableHead>
            <TableHead className="text-zinc-400">Deviation</TableHead>
            <TableHead className="text-zinc-400">Trend</TableHead>
            <TableHead className="text-zinc-400">Alerts 24h</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className="border-zinc-800">
                  <TableCell colSpan={10}>
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
                      "border-zinc-800 cursor-pointer transition-colors",
                      rowBgClass(latestScore.status),
                      isSelected && "ring-1 ring-inset ring-blue-500"
                    )}
                  >
                    <TableCell>
                      {latestScore.status === "critical" && (
                        <span className="block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-zinc-200">{unit.label}</TableCell>
                    <TableCell className="text-zinc-400">Suite {unit.suite}</TableCell>
                    <TableCell className="text-zinc-400">AC #{unit.acNumber}</TableCell>
                    <TableCell className="text-zinc-200 font-mono">{formatKwh(latestScore.actualKwh)}</TableCell>
                    <TableCell className="text-zinc-400 font-mono">{formatKwh(latestScore.baselineKwh)}</TableCell>
                    <TableCell className={cn("font-mono font-semibold", latestScore.pctDeviation > 30 ? "text-red-400" : latestScore.pctDeviation > 15 ? "text-yellow-400" : "text-green-400")}>
                      {formatPct(latestScore.pctDeviation)}
                    </TableCell>
                    <TableCell>
                      <TrendIcon trend={trend} />
                    </TableCell>
                    <TableCell className="text-zinc-400">{alertCount24h}</TableCell>
                    <TableCell>
                      <StatusBadge status={latestScore.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
