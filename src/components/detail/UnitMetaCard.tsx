"use client";

import { AcUnit, AnomalyScore } from "@/lib/types";
import { formatKwh, formatPct } from "@/lib/utils";
import { Zap, Calendar, Hash, Building } from "lucide-react";

interface UnitMetaCardProps {
  unit: AcUnit;
  latestScore: AnomalyScore;
}

export function UnitMetaCard({ unit, latestScore }: UnitMetaCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="flex items-center gap-2 text-zinc-400">
        <Building className="h-4 w-4 shrink-0" />
        <span>Suite <span className="text-zinc-200 font-medium">{unit.suite}</span></span>
      </div>
      <div className="flex items-center gap-2 text-zinc-400">
        <Hash className="h-4 w-4 shrink-0" />
        <span>AC <span className="text-zinc-200 font-medium">#{unit.acNumber}</span></span>
      </div>
      <div className="flex items-center gap-2 text-zinc-400">
        <Zap className="h-4 w-4 shrink-0" />
        <span>Rated <span className="text-zinc-200 font-medium">{unit.ratedCapacityKw} kW</span></span>
      </div>
      <div className="flex items-center gap-2 text-zinc-400">
        <Calendar className="h-4 w-4 shrink-0" />
        <span>Since <span className="text-zinc-200 font-medium">{unit.installDate}</span></span>
      </div>
      <div className="col-span-2 mt-1 p-3 rounded-md bg-zinc-800/60 flex justify-between">
        <div>
          <div className="text-xs text-zinc-500 mb-0.5">Current Draw</div>
          <div className="text-lg font-bold text-zinc-100 font-mono">{formatKwh(latestScore.actualKwh)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 mb-0.5">vs Baseline</div>
          <div className={`text-lg font-bold font-mono ${latestScore.pctDeviation > 30 ? "text-red-400" : latestScore.pctDeviation > 15 ? "text-yellow-400" : "text-green-400"}`}>
            {formatPct(latestScore.pctDeviation)}
          </div>
        </div>
      </div>
    </div>
  );
}
