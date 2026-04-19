"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUILDING_CONFIG } from "@/lib/constants";
import { SlidersHorizontal } from "lucide-react";

interface Filters {
  suite: string;
  acNumber: string;
  status: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const triggerClass =
    "w-36 rounded-lg border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-900 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/20";
  const contentClass = "border-zinc-800 bg-zinc-950";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-medium text-zinc-400">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filter
      </div>

      <Select
        value={filters.suite}
        onValueChange={(v) => onChange({ ...filters, suite: v ?? "all" })}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Suite" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All suites</SelectItem>
          {BUILDING_CONFIG.SUITES.map((s) => (
            <SelectItem key={s} value={s}>
              Suite {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.acNumber}
        onValueChange={(v) => onChange({ ...filters, acNumber: v ?? "all" })}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="AC unit" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All units</SelectItem>
          {Array.from(
            { length: BUILDING_CONFIG.ACS_PER_SUITE },
            (_, i) => i + 1
          ).map((n) => (
            <SelectItem key={n} value={String(n)}>
              AC #{n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v) => onChange({ ...filters, status: v ?? "all" })}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
