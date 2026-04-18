"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, Zap, CheckCircle } from "lucide-react";
import { UnitSummary } from "@/lib/types";

export function SummaryCards({ units }: { units: UnitSummary[] }) {
  const critical = units.filter((u) => u.latestScore.status === "critical").length;
  const warning = units.filter((u) => u.latestScore.status === "warning").length;
  const avgDev =
    units.length > 0
      ? units.reduce((sum, u) => sum + u.latestScore.pctDeviation, 0) / units.length
      : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Total Units</CardTitle>
          <Activity className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{units.length}</div>
          <p className="text-xs text-zinc-500 mt-1">Monitored AC units</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Critical</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{critical}</div>
          <p className="text-xs text-zinc-500 mt-1">Needs immediate attention</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Warning</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">{warning}</div>
          <p className="text-xs text-zinc-500 mt-1">Monitor closely</p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Avg Deviation</CardTitle>
          <Zap className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${avgDev > 15 ? "text-red-400" : avgDev > 5 ? "text-yellow-400" : "text-green-400"}`}>
            {avgDev >= 0 ? "+" : ""}{avgDev.toFixed(1)}%
          </div>
          <p className="text-xs text-zinc-500 mt-1">vs rolling baseline</p>
        </CardContent>
      </Card>
    </div>
  );
}
