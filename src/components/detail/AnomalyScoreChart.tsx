"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { UnitDetail } from "@/lib/types";
import { format } from "date-fns";

interface Props {
  detail: UnitDetail;
}

export function AnomalyScoreChart({ detail }: Props) {
  const data = detail.scores.map((s) => ({
    label: format(new Date(s.timestamp), "HH:mm"),
    deviation: s.pctDeviation,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id="deviationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} interval={3} />
        <YAxis tick={{ fill: "#71717a", fontSize: 11 }} unit="%" width={45} />
        <Tooltip
          contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 6 }}
          labelStyle={{ color: "#a1a1aa" }}
          formatter={(val) => { const n = Number(val); return [`${n >= 0 ? "+" : ""}${n.toFixed(1)}%`, "Deviation"]; }}
        />
        <ReferenceLine y={15} stroke="#eab308" strokeDasharray="3 3" label={{ value: "Warning", fill: "#eab308", fontSize: 10 }} />
        <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Critical", fill: "#ef4444", fontSize: 10 }} />
        <ReferenceLine y={0} stroke="#3f3f46" />
        <Area
          type="monotone"
          dataKey="deviation"
          stroke="#f97316"
          strokeWidth={2}
          fill="url(#deviationGradient)"
          name="Deviation"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
