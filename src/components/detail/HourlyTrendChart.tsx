"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { UnitDetail } from "@/lib/types";
import { format } from "date-fns";

interface Props {
  detail: UnitDetail;
}

export function HourlyTrendChart({ detail }: Props) {
  const data = detail.readings.map((r, i) => {
    const score = detail.scores[i];
    const hour = new Date(r.timestamp).getUTCHours();
    const bp = detail.baseline.find((b) => b.hour === hour);
    return {
      label: format(new Date(r.timestamp), "HH:mm"),
      actual: r.actualKwh,
      baseline: bp?.avgKwh ?? 0,
      warning: bp ? bp.avgKwh * 1.15 : 0,
      critical: bp ? bp.avgKwh * 1.30 : 0,
      status: score?.status,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} interval={3} />
        <YAxis tick={{ fill: "#71717a", fontSize: 11 }} unit=" kWh" width={60} />
        <Tooltip
          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 6 }}
          labelStyle={{ color: "#a1a1aa" }}
          formatter={(val) => [`${Number(val).toFixed(2)} kWh`]}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#a1a1aa" }} />
        <Line type="monotone" dataKey="actual" stroke="#f97316" strokeWidth={2} dot={false} name="Actual" />
        <Line type="monotone" dataKey="baseline" stroke="#52525b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Baseline" />
        <ReferenceLine y={data[0]?.warning} stroke="#eab308" strokeDasharray="3 3" label={{ value: "+15%", fill: "#eab308", fontSize: 10 }} />
        <ReferenceLine y={data[0]?.critical} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "+30%", fill: "#ef4444", fontSize: 10 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
