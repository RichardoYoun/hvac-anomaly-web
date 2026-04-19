"use client";

import { FcuRow } from "@/lib/fcu";
import { cn } from "@/lib/utils";

function rowBg(status: FcuRow["status"]) {
  if (status === "critical") return "bg-red-950/40 border-l-2 border-red-500";
  if (status === "warning") return "bg-yellow-950/30 border-l-2 border-yellow-500";
  return "border-l-2 border-transparent";
}

function StatusDot({ status }: { status: FcuRow["status"] }) {
  if (status === "critical") return <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />;
  if (status === "warning") return <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />;
}

interface Props {
  feed: FcuRow[];
}

export function FcuLiveFeed({ feed }: Props) {
  return (
    <div className="rounded-lg border border-zinc-800 overflow-hidden">
      <div className="px-3 py-2 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">Recent Events</span>
        <span className="text-xs text-zinc-600">{feed.length} rows</span>
      </div>
      <div className="divide-y divide-zinc-800/50 max-h-80 overflow-y-auto">
        {feed.length === 0 && (
          <div className="px-4 py-6 text-center text-xs text-zinc-600">Waiting for data…</div>
        )}
        {[...feed].reverse().map((row, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs transition-colors",
              rowBg(row.status),
              i === 0 && "bg-zinc-800/20"
            )}
          >
            <StatusDot status={row.status} />
            <span className="font-mono text-zinc-500 w-32 shrink-0">{row.time}</span>
            <span className={cn(
              "flex-1 truncate",
              row.status === "critical" ? "text-red-300 font-medium" :
              row.status === "warning" ? "text-yellow-300" :
              "text-zinc-400"
            )}>
              {row.label}
            </span>
            <span className="font-mono text-zinc-600 shrink-0">{row.returnTemp?.toFixed(1)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
