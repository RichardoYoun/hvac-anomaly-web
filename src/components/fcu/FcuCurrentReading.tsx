"use client";

import { FcuRow } from "@/lib/fcu";
import { cn } from "@/lib/utils";
import { Thermometer, Wind, Droplets, Gauge } from "lucide-react";

function SensorCard({
  label,
  value,
  unit = "°C",
  icon: Icon,
  highlight,
}: {
  label: string;
  value: number | null;
  unit?: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl p-4 border transition-colors duration-500 min-w-0",
      highlight
        ? "bg-red-950/50 border-red-700"
        : "bg-zinc-900 border-zinc-800"
    )}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4 shrink-0", highlight ? "text-red-400" : "text-zinc-500")} />
        <span className="text-xs text-zinc-500 truncate">{label}</span>
      </div>
      <div className={cn(
        "text-xl leading-tight font-bold font-mono tabular-nums break-words text-center",
        highlight ? "text-red-300" : "text-zinc-100"
      )}>
        {value !== null ? `${value.toFixed(2)}${unit}` : "—"}
      </div>
    </div>
  );
}

interface Props {
  row: FcuRow;
  prevRow: FcuRow | null;
}

export function FcuCurrentReading({ row, prevRow }: Props) {
  void prevRow;
  const isFanFault = row.label === "Supply fan fault";
  const isValveFault = row.label === "Valve position fault";
  const isReturnFault = row.label === "Return air temperature fault";
  const isSupplyFault = row.label === "Supply air temperature fault";

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <div>
          <div className="text-xs text-zinc-500 mb-0.5">Current Reading</div>
          <div className="text-base sm:text-lg font-mono font-semibold text-zinc-100 break-all">{row.time}</div>
        </div>
        <div className={cn(
          "max-w-full px-3 py-1.5 rounded-full text-sm font-semibold border truncate",
          row.status === "critical"
            ? "bg-red-950/60 border-red-700 text-red-300"
            : row.status === "warning"
              ? "bg-yellow-950/60 border-yellow-700 text-yellow-300"
              : "bg-green-950/40 border-green-800 text-green-400"
        )}>
          {row.status === "normal" ? "Normal" : row.label}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SensorCard label="Setpoint" value={row.setPointTemp} icon={Gauge} />
        <SensorCard label="Return Temp" value={row.returnTemp} icon={Thermometer} highlight={isReturnFault} />
        <SensorCard label="Supply Air" value={row.supplyAirTemp} icon={Thermometer} highlight={isSupplyFault} />
        <SensorCard label="Supply Fan" value={row.supplyFan} unit="" icon={Wind} highlight={isFanFault} />
        <SensorCard label="Valve Position" value={row.valvePosition} unit="%" icon={Droplets} highlight={isValveFault} />
        <SensorCard label="Cooling Supply 1" value={row.coolingSupplyTemp1} icon={Thermometer} />
      </div>
    </div>
  );
}
