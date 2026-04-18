import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UnitStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKwh(kwh: number): string {
  return `${kwh.toFixed(2)} kWh`
}

export function formatPct(pct: number): string {
  const sign = pct >= 0 ? "+" : ""
  return `${sign}${pct.toFixed(1)}%`
}

export function statusColor(status: UnitStatus): string {
  switch (status) {
    case "critical": return "text-red-400"
    case "warning": return "text-yellow-400"
    case "normal": return "text-green-400"
    default: return "text-zinc-500"
  }
}

export function rowBgClass(status: UnitStatus): string {
  switch (status) {
    case "critical": return "bg-red-950/40 hover:bg-red-950/60 border-l-4 border-red-500"
    case "warning": return "bg-yellow-950/30 hover:bg-yellow-950/50 border-l-4 border-yellow-500"
    default: return "hover:bg-zinc-800/40 border-l-4 border-transparent"
  }
}
