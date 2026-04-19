"use client";

import { AlertTriangle, Activity, TrendingUp, CircleCheck } from "lucide-react";
import { UnitSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SummaryCards({ units }: { units: UnitSummary[] }) {
  const critical = units.filter((u) => u.latestScore.status === "critical").length;
  const warning = units.filter((u) => u.latestScore.status === "warning").length;
  const normal = units.length - critical - warning;
  const avgDev =
    units.length > 0
      ? units.reduce((sum, u) => sum + u.latestScore.pctDeviation, 0) / units.length
      : 0;

  const cards = [
    {
      label: "Total units",
      value: String(units.length),
      hint: "Monitored AC units",
      icon: Activity,
      tone: "brand" as const,
    },
    {
      label: "Critical",
      value: String(critical),
      hint: "Immediate attention",
      icon: AlertTriangle,
      tone: "red" as const,
    },
    {
      label: "Warning",
      value: String(warning),
      hint: "Monitor closely",
      icon: AlertTriangle,
      tone: "amber" as const,
    },
    {
      label: "Avg deviation",
      value: `${avgDev >= 0 ? "+" : ""}${avgDev.toFixed(1)}%`,
      hint: "vs rolling baseline",
      icon: TrendingUp,
      tone:
        avgDev > 15
          ? ("red" as const)
          : avgDev > 5
            ? ("amber" as const)
            : ("emerald" as const),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label} {...c} />
      ))}
      <div className="hidden" aria-hidden>
        {normal}
      </div>
    </div>
  );
}

type Tone = "brand" | "red" | "amber" | "emerald";

function Card({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: typeof Activity;
  tone: Tone;
}) {
  const toneRing: Record<Tone, string> = {
    brand: "from-indigo-500/20 to-indigo-500/0 ring-indigo-500/20",
    red: "from-red-500/20 to-red-500/0 ring-red-500/20",
    amber: "from-amber-500/20 to-amber-500/0 ring-amber-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/0 ring-emerald-500/20",
  };
  const toneIcon: Record<Tone, string> = {
    brand: "text-indigo-400 bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/20",
    red: "text-red-400 bg-red-500/10 ring-1 ring-inset ring-red-500/20",
    amber: "text-amber-400 bg-amber-500/10 ring-1 ring-inset ring-amber-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/20",
  };
  const toneValue: Record<Tone, string> = {
    brand: "text-zinc-100",
    red: "text-red-300",
    amber: "text-amber-300",
    emerald: "text-emerald-300",
  };
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 transition hover:border-zinc-700"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-60 blur-2xl",
          toneRing[tone]
        )}
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </span>
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", toneIcon[tone])}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className={cn("relative mt-4 text-3xl font-semibold tracking-tight tabular-nums", toneValue[tone])}>
        {value}
      </div>
      <div className="relative mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
        <CircleCheck className="h-3 w-3 text-zinc-600" />
        {hint}
      </div>
    </div>
  );
}
