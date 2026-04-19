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
import { X } from "lucide-react";
import { UnitStatus } from "@/lib/types";
import { FcuSession } from "@/lib/fcu";
import { StatusBadge } from "./StatusBadge";
import { cn, rowBgClass } from "@/lib/utils";

interface UnitsTableProps {
  fcuSessions: FcuSession[];
  loading: boolean;
  selectedFcuId: string | null;
  onSelectFcu: (id: string) => void;
  onRemoveFcu: (id: string) => void;
}

export function UnitsTable({
  fcuSessions,
  loading,
  selectedFcuId,
  onSelectFcu,
  onRemoveFcu,
}: UnitsTableProps) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400 w-8" />
            <TableHead className="text-zinc-400">FCU</TableHead>
            <TableHead className="text-zinc-400">Source File</TableHead>
            <TableHead className="text-zinc-400">Stream</TableHead>
            <TableHead className="text-zinc-400">Time</TableHead>
            <TableHead className="text-zinc-400">Supply Air</TableHead>
            <TableHead className="text-zinc-400">Return</TableHead>
            <TableHead className="text-zinc-400">Set Point</TableHead>
            <TableHead className="text-zinc-400">Fault Label</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="border-zinc-800">
                <TableCell colSpan={10}>
                  <Skeleton className="h-6 w-full bg-zinc-800" />
                </TableCell>
              </TableRow>
            ))
          ) : fcuSessions.length === 0 ? (
            <TableRow className="border-zinc-800">
              <TableCell colSpan={10} className="py-10 text-center text-zinc-500">
                Upload an FCU CSV log to start the live monitoring stream.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {fcuSessions.map((s) => {
                const cur = s.rows[s.latestIndex];
                const isSelected = selectedFcuId === s.id;
                const pct = Math.round(((s.latestIndex + 1) / s.rows.length) * 100);
                return (
                  <TableRow
                    key={s.id}
                    onClick={() => onSelectFcu(s.id)}
                    className={cn(
                      "border-zinc-800 cursor-pointer transition-colors",
                      rowBgClass(cur.status as UnitStatus),
                      isSelected && "ring-1 ring-inset ring-blue-500"
                    )}
                  >
                    <TableCell>
                      {cur.status === "critical" && (
                        <span className="block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                      {cur.status === "warning" && (
                        <span className="block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-xs bg-blue-900/50 text-blue-300 border border-blue-800 font-mono shrink-0">
                          FCU
                        </span>
                        {s.unitName}
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-xs max-w-[120px] truncate">{s.fileName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-16 bg-zinc-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 transition-all duration-200"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 font-mono tabular-nums">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400 font-mono">{cur.time || "—"}</TableCell>
                    <TableCell className="text-zinc-200 font-mono">
                      {cur.supplyAirTemp !== null ? `${cur.supplyAirTemp.toFixed(1)}°C` : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-300 font-mono">
                      {cur.returnTemp !== null ? `${cur.returnTemp.toFixed(1)}°C` : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-400 font-mono">
                      {cur.setPointTemp !== null ? `${cur.setPointTemp.toFixed(1)}°C` : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-400 text-xs max-w-[220px] truncate">{cur.label}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge status={cur.status as UnitStatus} />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFcu(s.id);
                          }}
                          className="text-zinc-500 hover:text-zinc-200 transition-colors"
                          aria-label={`Remove ${s.unitName}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
