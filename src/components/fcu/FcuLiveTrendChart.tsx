"use client";

import { FcuRow } from "@/lib/fcu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  rows: FcuRow[];
  index: number;
}

function formatShortTime(raw: string): string {
  const parts = raw.trim().split(/\s+/);
  if (parts.length >= 2) return parts[parts.length - 1];
  return raw;
}

export function FcuLiveTrendChart({ rows, index }: Props) {
  const windowStart = Math.max(0, index - 39);
  const windowRows = rows.slice(windowStart, index + 1);

  const data = windowRows.map((row, pointIndex) => ({
    x: pointIndex,
    label: formatShortTime(row.time),
    fullTime: row.time,
    setPoint: row.setPointTemp,
    returnTemp: row.returnTemp,
    supplyAir: row.supplyAirTemp,
  }));

  if (data.length < 2) {
    return (
      <div className="h-40 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-xs text-zinc-500">
        Waiting for enough FCU points to render live trend...
      </div>
    );
  }

  return (
    <div className="h-48 rounded-lg border border-zinc-800 bg-zinc-900/40 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[0, Math.max(1, data.length - 1)]}
            tick={{ fill: "#71717a", fontSize: 10 }}
            minTickGap={20}
            tickFormatter={(value) => data[value]?.label ?? ""}
          />
          <YAxis tick={{ fill: "#71717a", fontSize: 10 }} width={44} unit="°C" />
          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#a1a1aa" }}
            labelFormatter={(value) => data[Number(value)]?.fullTime ?? ""}
            formatter={(value, name) => {
              if (value === null || value === undefined) return ["—", name];
              const num = typeof value === "number" ? value : Number(value);
              if (Number.isNaN(num)) return ["—", name];
              return [`${num.toFixed(2)}°C`, name];
            }}
          />
          <Line
            type="monotone"
            dataKey="setPoint"
            name="Setpoint"
            stroke="#a1a1aa"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="returnTemp"
            name="Return"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="supplyAir"
            name="Supply Air"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
