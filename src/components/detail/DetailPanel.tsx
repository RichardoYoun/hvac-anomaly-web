"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { UnitDetail, UnitSummary } from "@/lib/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { UnitMetaCard } from "./UnitMetaCard";
import { HourlyTrendChart } from "./HourlyTrendChart";
import { AnomalyScoreChart } from "./AnomalyScoreChart";

interface Props {
  selected: UnitSummary | null;
  onClose: () => void;
}

export function DetailPanel({ selected, onClose }: Props) {
  const [detail, setDetail] = useState<UnitDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected) {
      setDetail(null);
      return;
    }
    setLoading(true);
    fetch(`/api/units/${selected.unit.id}`)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .finally(() => setLoading(false));
  }, [selected?.unit.id]);

  return (
    <Sheet open={!!selected} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-zinc-950 border-zinc-800 text-zinc-100 overflow-y-auto"
      >
        {selected && (
          <>
            <SheetHeader className="mb-4">
              <div className="flex items-center gap-3">
                <SheetTitle className="text-zinc-100 text-lg">{selected.unit.label}</SheetTitle>
                <StatusBadge status={selected.latestScore.status} />
              </div>
            </SheetHeader>

            {loading || !detail ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full bg-zinc-800" />
                <Skeleton className="h-48 w-full bg-zinc-800" />
                <Skeleton className="h-40 w-full bg-zinc-800" />
              </div>
            ) : (
              <div className="space-y-6">
                <UnitMetaCard unit={detail.unit} latestScore={detail.scores[detail.scores.length - 1] ?? selected.latestScore} />

                <Separator className="bg-zinc-800" />

                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Energy Draw vs Baseline (24h)</h3>
                  <HourlyTrendChart detail={detail} />
                </div>

                <Separator className="bg-zinc-800" />

                <div>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3">Deviation from Baseline (%)</h3>
                  <AnomalyScoreChart detail={detail} />
                  <p className="text-xs text-zinc-500 mt-2">
                    Yellow zone ≥15% above baseline &middot; Red zone ≥30% above baseline
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
