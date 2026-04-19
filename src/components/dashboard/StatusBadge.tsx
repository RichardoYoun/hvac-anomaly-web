"use client";

import { UnitStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<UnitStatus, { dot: string; text: string; ring: string; label: string }> = {
  critical: {
    dot: "bg-red-500",
    text: "text-red-300",
    ring: "bg-red-500/10 ring-red-500/30",
    label: "Critical",
  },
  warning: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    ring: "bg-amber-500/10 ring-amber-500/30",
    label: "Warning",
  },
  normal: {
    dot: "bg-emerald-500",
    text: "text-emerald-300",
    ring: "bg-emerald-500/10 ring-emerald-500/30",
    label: "Normal",
  },
};

export function StatusBadge({ status }: { status: UnitStatus }) {
  const s = styles[status] ?? {
    dot: "bg-zinc-500",
    text: "text-zinc-400",
    ring: "bg-zinc-500/10 ring-zinc-500/30",
    label: "Offline",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        s.ring,
        s.text
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}
