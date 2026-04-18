"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Activity, Thermometer } from "lucide-react";
import { FcuSummaryStats } from "@/lib/fcu";

export function FcuSummaryCards({ stats, fileName }: { stats: FcuSummaryStats; fileName: string }) {
  const faultPct = stats.total > 0 ? ((stats.faultCount / stats.total) * 100).toFixed(1) : "0";
  const faultTypes = Object.entries(stats.byLabel).filter(([k]) => k !== "Normal condition");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Activity className="h-4 w-4" />
        <span className="text-zinc-300 font-medium">{fileName}</span>
        <span>— {stats.total.toLocaleString()} readings</span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Readings</CardTitle>
            <Activity className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-zinc-500 mt-1">hourly observations</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Normal</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.normalCount.toLocaleString()}</div>
            <p className="text-xs text-zinc-500 mt-1">{stats.total > 0 ? ((stats.normalCount / stats.total) * 100).toFixed(1) : 0}% of readings</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Fault Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.faultCount.toLocaleString()}</div>
            <p className="text-xs text-zinc-500 mt-1">{faultPct}% of readings</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Fault Types</CardTitle>
            <Thermometer className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{faultTypes.length}</div>
            <p className="text-xs text-zinc-500 mt-1">distinct fault categories</p>
          </CardContent>
        </Card>
      </div>

      {faultTypes.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {faultTypes.map(([label, count]) => (
            <div key={label} className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
              <div className="text-xs text-zinc-500 mb-1">{label}</div>
              <div className="text-lg font-bold text-zinc-200">{count.toLocaleString()}</div>
              <div className="text-xs text-zinc-600">{((count / stats.total) * 100).toFixed(1)}% of total</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
