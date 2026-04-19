"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, Zap } from "lucide-react";
import { FcuSession } from "@/lib/fcu";

interface SummaryCardsProps {
  fcuSessions: FcuSession[];
}

export function SummaryCards({ fcuSessions }: SummaryCardsProps) {
  const currentFcuRows = fcuSessions
    .map((session) => session.rows[session.latestIndex])
    .filter((row) => row !== undefined);
  const total = currentFcuRows.length;
  const critical = currentFcuRows.filter((row) => row.status === "critical").length;
  const warning = currentFcuRows.filter((row) => row.status === "warning").length;
  const faultRate = total > 0 ? ((critical + warning) / total) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400">Active FCUs</CardTitle>
          <Activity className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{total}</div>
          <p className="text-xs text-zinc-500 mt-1">Streaming FCU logs</p>
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
          <CardTitle className="text-sm font-medium text-zinc-400">Fault Rate</CardTitle>
          <Zap className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              faultRate > 50 ? "text-red-400" : faultRate > 20 ? "text-yellow-400" : "text-green-400"
            }`}
          >
            {faultRate.toFixed(1)}%
          </div>
          <p className="text-xs text-zinc-500 mt-1">of FCUs in warning/critical</p>
        </CardContent>
      </Card>
    </div>
  );
}
