"use client";

import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { FcuSession } from "@/lib/fcu";
import { UnitStatus } from "@/lib/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { FcuCurrentReading } from "./FcuCurrentReading";
import { FcuLiveTrendChart } from "./FcuLiveTrendChart";
import { cn } from "@/lib/utils";
import { Gauge, Pause, Play, X } from "lucide-react";

interface Props {
  session: FcuSession | null;
  onClose: () => void;
  onTogglePlayback: () => void;
  onSeek: (index: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function FcuDetailPanel({ session, onClose, onTogglePlayback, onSeek, onSpeedChange }: Props) {
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [onClose, session]);

  if (!session) return null;

  const cur = session.rows[session.index];
  const prev = session.index > 0 ? session.rows[session.index - 1] : null;
  const pct = Math.round(((session.index + 1) / session.rows.length) * 100);
  const recentRows = session.rows
    .slice(Math.max(0, session.index - 80), session.index + 1)
    .reverse();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div
        className="mx-auto h-full max-h-[90vh] w-full max-w-6xl rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-4 py-4 sm:px-6">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-1.5 py-0.5 rounded text-xs bg-blue-900/50 text-blue-300 border border-blue-800 font-mono">
                FCU
              </span>
              <h2 className="text-zinc-100 text-lg break-all font-semibold">{session.unitName}</h2>
              <StatusBadge status={cur.status as UnitStatus} />
            </div>
            <p className="text-xs text-zinc-500 break-all">{session.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 min-h-0 gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="overflow-y-auto px-4 py-4 sm:px-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <Gauge className="h-3.5 w-3.5 shrink-0" />
              <span className="shrink-0">
                {session.playing ? "LIVE" : "PAUSED"} · Row {session.index + 1} of {session.rows.length}
              </span>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden sm:flex-1 sm:w-auto">
                <div
                  className="h-full bg-orange-500 transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-mono tabular-nums">{pct}%</span>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 px-2.5 py-2">
              <div className="flex items-center justify-end mb-1">
                <button
                  onClick={onTogglePlayback}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium border transition-colors",
                    session.playing
                      ? "border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      : "border-orange-400/40 bg-orange-500/15 text-orange-200 hover:bg-orange-500/25"
                  )}
                >
                  {session.playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  {session.playing ? "Pause" : "Resume"}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-zinc-400">Playback Speed</span>
                <span className="font-mono text-zinc-300 text-[11px]">{session.speed}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={session.speed}
                onChange={(event) => onSpeedChange(Number(event.target.value))}
                className="mt-1.5 w-full accent-orange-500 h-1"
                aria-label="Playback speed"
              />
              <div className="mt-0.5 flex justify-between text-[10px] text-zinc-500">
                <span>1x</span>
                <span>10x</span>
                <span>20x</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Live Trend</h3>
              <FcuLiveTrendChart rows={session.rows} index={session.index} />
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 px-2.5 py-2">
              <div className="flex items-center justify-between gap-3 text-[11px] text-zinc-500">
                <span className="truncate">Timeline</span>
                <span className="font-mono text-zinc-300">
                  {session.rows[session.index]?.time || "—"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, session.rows.length - 1)}
                step={1}
                value={session.index}
                onChange={(event) => onSeek(Number(event.target.value))}
                className="mt-1.5 w-full accent-orange-500 h-1"
                aria-label="Timeline seek"
              />
              <div className="mt-0.5 flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>0:00</span>
                <span>
                  {Math.floor(session.index / 60)}:{String(session.index % 60).padStart(2, "0")}
                </span>
                <span>
                  {Math.floor((session.rows.length - 1) / 60)}:
                  {String((session.rows.length - 1) % 60).padStart(2, "0")}
                </span>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Current Stats</h3>
              <FcuCurrentReading row={cur} prevRow={prev} />
            </div>
          </div>

          <aside className="border-t lg:border-t-0 lg:border-l border-zinc-800 min-h-0 flex flex-col">
            <div className="px-4 py-3 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-300">Live Log</h3>
              <p className="text-xs text-zinc-500 mt-1">Most recent entries first</p>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {recentRows.map((row, i) => (
                <div
                  key={`${row.time}-${i}`}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-xs",
                    i === 0
                      ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono truncate">{row.time}</span>
                    <span
                      className={cn(
                        "truncate text-right",
                        row.status === "critical"
                          ? "text-red-400"
                          : row.status === "warning"
                          ? "text-yellow-400"
                          : "text-green-500"
                      )}
                    >
                      {row.label}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500 font-mono">
                    SAT {row.supplyAirTemp !== null ? row.supplyAirTemp.toFixed(2) : "—"}°C · RAT{" "}
                    {row.returnTemp !== null ? row.returnTemp.toFixed(2) : "—"}°C
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
