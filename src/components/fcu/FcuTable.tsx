"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FcuRow } from "@/lib/fcu";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;

function StatusBadge({ status, label }: { status: FcuRow["status"]; label: string }) {
  if (status === "normal") return <Badge variant="outline" className="text-green-400 border-green-800 text-xs">Normal</Badge>;
  if (status === "critical") return <Badge className="bg-red-600 text-white text-xs hover:bg-red-600">{label}</Badge>;
  return <Badge className="bg-yellow-600 text-white text-xs hover:bg-yellow-600">{label}</Badge>;
}

function fmt(v: number | null): string {
  return v === null ? "—" : v.toFixed(2);
}

function rowClass(status: FcuRow["status"]): string {
  if (status === "critical") return "bg-red-950/40 hover:bg-red-950/60 border-l-4 border-red-500";
  if (status === "warning") return "bg-yellow-950/30 hover:bg-yellow-950/50 border-l-4 border-yellow-500";
  return "hover:bg-zinc-800/40 border-l-4 border-transparent";
}

interface FcuTableProps {
  rows: FcuRow[];
}

export function FcuTable({ rows }: FcuTableProps) {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");

  const uniqueLabels = useMemo(
    () => Array.from(new Set(rows.map((r) => r.label))).sort(),
    [rows]
  );

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (labelFilter !== "all" && r.label !== labelFilter) return false;
      return true;
    });
  }, [rows, statusFilter, labelFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function changeFilter(fn: () => void) {
    fn();
    setPage(0);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-400">Filter:</span>

        <Select value={statusFilter} onValueChange={(v) => changeFilter(() => setStatusFilter(v ?? "all"))}>
          <SelectTrigger className="w-36 bg-zinc-900 border-zinc-700 text-zinc-200 h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={labelFilter} onValueChange={(v) => changeFilter(() => setLabelFilter(v ?? "all"))}>
          <SelectTrigger className="w-56 bg-zinc-900 border-zinc-700 text-zinc-200 h-8 text-sm">
            <SelectValue placeholder="Fault type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All Labels</SelectItem>
            {uniqueLabels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>

        <span className="text-xs text-zinc-500 ml-auto">
          {filtered.length.toLocaleString()} rows
        </span>
      </div>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 w-4"></TableHead>
              <TableHead className="text-zinc-400">Time</TableHead>
              <TableHead className="text-zinc-400">Setpoint</TableHead>
              <TableHead className="text-zinc-400">Return Temp</TableHead>
              <TableHead className="text-zinc-400">Supply Air</TableHead>
              <TableHead className="text-zinc-400">Fan</TableHead>
              <TableHead className="text-zinc-400">Valve %</TableHead>
              <TableHead className="text-zinc-400">Cool 1</TableHead>
              <TableHead className="text-zinc-400">Cool 2</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row, i) => (
              <TableRow key={i} className={cn("border-zinc-800 transition-colors", rowClass(row.status))}>
                <TableCell>
                  {row.status === "critical" && (
                    <span className="block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-zinc-300">{row.time}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-400">{fmt(row.setPointTemp)}°</TableCell>
                <TableCell className={cn("font-mono text-xs", row.status !== "normal" ? "text-zinc-200 font-semibold" : "text-zinc-400")}>{fmt(row.returnTemp)}°</TableCell>
                <TableCell className={cn("font-mono text-xs", row.label === "Supply air temperature fault" ? "text-red-400 font-semibold" : "text-zinc-400")}>{fmt(row.supplyAirTemp)}°</TableCell>
                <TableCell className={cn("font-mono text-xs", row.label === "Supply fan fault" ? "text-red-400 font-semibold" : "text-zinc-400")}>{fmt(row.supplyFan)}</TableCell>
                <TableCell className={cn("font-mono text-xs", row.label === "Valve position fault" ? "text-yellow-400 font-semibold" : "text-zinc-400")}>{fmt(row.valvePosition)}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{fmt(row.coolingSupplyTemp1)}°</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{fmt(row.coolingSupplyTemp2)}°</TableCell>
                <TableCell><StatusBadge status={row.status} label={row.label} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>Page {page + 1} of {totalPages}</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="bg-zinc-900 border-zinc-700 text-zinc-300 h-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="bg-zinc-900 border-zinc-700 text-zinc-300 h-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
