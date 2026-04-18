"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUILDING_CONFIG } from "@/lib/constants";

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
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm text-zinc-400 font-medium">Filter by:</span>

      <Select
        value={filters.suite}
        onValueChange={(v) => onChange({ ...filters, suite: v ?? "all" })}
      >
        <SelectTrigger className="w-36 bg-zinc-900 border-zinc-700 text-zinc-200">
          <SelectValue placeholder="Suite" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700">
          <SelectItem value="all">All Suites</SelectItem>
          {BUILDING_CONFIG.SUITES.map((s) => (
            <SelectItem key={s} value={s}>Suite {s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.acNumber}
        onValueChange={(v) => onChange({ ...filters, acNumber: v ?? "all" })}
      >
        <SelectTrigger className="w-36 bg-zinc-900 border-zinc-700 text-zinc-200">
          <SelectValue placeholder="AC Unit" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700">
          <SelectItem value="all">All Units</SelectItem>
          {Array.from({ length: BUILDING_CONFIG.ACS_PER_SUITE }, (_, i) => i + 1).map((n) => (
            <SelectItem key={n} value={String(n)}>AC #{n}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v) => onChange({ ...filters, status: v ?? "all" })}
      >
        <SelectTrigger className="w-36 bg-zinc-900 border-zinc-700 text-zinc-200">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="warning">Warning</SelectItem>
          <SelectItem value="normal">Normal</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
