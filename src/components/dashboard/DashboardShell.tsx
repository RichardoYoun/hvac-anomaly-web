"use client";

import { useEffect, useState, useCallback } from "react";
import { UnitSummary } from "@/lib/types";
import { SummaryCards } from "./SummaryCards";
import { FilterBar } from "./FilterBar";
import { UnitsTable } from "./UnitsTable";
import { DetailPanel } from "@/components/detail/DetailPanel";
import { RefreshCw } from "lucide-react";

interface Filters {
  suite: string;
  acNumber: string;
  status: string;
}

export function DashboardShell() {
  const [allUnits, setAllUnits] = useState<UnitSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ suite: "all", acNumber: "all", status: "all" });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchUnits = useCallback(async () => {
    try {
      const res = await fetch("/api/units");
      const data: UnitSummary[] = await res.json();
      setAllUnits(data);
      setLastUpdated(new Date());
    } catch {
      // silently keep stale data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
    const interval = setInterval(fetchUnits, 60_000);
    return () => clearInterval(interval);
  }, [fetchUnits]);

  const filtered = allUnits.filter((u) => {
    if (filters.suite !== "all" && u.unit.suite !== filters.suite) return false;
    if (filters.acNumber !== "all" && String(u.unit.acNumber) !== filters.acNumber) return false;
    if (filters.status !== "all" && u.latestScore.status !== filters.status) return false;
    return true;
  });

  const selectedUnit = allUnits.find((u) => u.unit.id === selectedUnitId) ?? null;

  return (
    <div className="space-y-6">
      <SummaryCards units={allUnits} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <RefreshCw className="h-3 w-3" />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Loading…"}
        </div>
      </div>

      <UnitsTable
        units={filtered}
        loading={loading}
        selectedUnitId={selectedUnitId}
        onSelect={(id) => setSelectedUnitId(selectedUnitId === id ? null : id)}
      />

      <DetailPanel
        selected={selectedUnit}
        onClose={() => setSelectedUnitId(null)}
      />
    </div>
  );
}
