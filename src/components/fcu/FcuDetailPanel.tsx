"use client";

import { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { FcuSession } from "@/lib/fcu";
import { UnitStatus } from "@/lib/types";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { FcuCurrentReading } from "./FcuCurrentReading";
import { FcuLiveTrendChart } from "./FcuLiveTrendChart";
import { cn } from "@/lib/utils";
import { Gauge, Radio, Rewind, X } from "lucide-react";

interface Props {
  session: FcuSession | null;
  onClose: () => void;
  onSeek: (index: number) => void;
  onJumpToLive: () => void;
}

export function FcuDetailPanel({ session, onClose, onSeek, onJumpToLive }: Props) {
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
  const latestRow = session.rows[session.latestIndex];
  const isLive = session.index === session.latestIndex;
  const latestMax = Math.max(1, session.latestIndex);
  const viewPct =
    session.latestIndex === 0
      ? 100
      : Math.round((session.index / session.latestIndex) * 100);
  const streamProgressPct = Math.round(
    ((session.latestIndex + 1) / session.rows.length) * 100
  );
  const recentRows = session.rows
    .slice(Math.max(0, session.latestIndex - 80), session.latestIndex + 1)
    .reverse();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-4 py-4 sm:px-6">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded border border-blue-800 bg-blue-900/50 px-1.5 py-0.5 font-mono text-xs text-blue-300">
                FCU
              </span>
              <h2 className="break-all text-lg font-semibold text-zinc-100">
                {session.unitName}
              </h2>
              <StatusBadge status={cur.status as UnitStatus} />
              <LiveChip isLive={isLive} streamEnded={session.latestIndex >= session.rows.length - 1} />
            </div>
            <p className="break-all text-xs text-zinc-500">{session.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <Gauge className="h-3.5 w-3.5 shrink-0" />
              <span className="shrink-0">
                {isLive ? "Tracking live" : "Viewing history"} · Row {session.index + 1} of {session.rows.length}
              </span>
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800 sm:w-auto sm:flex-1">
                <div
                  className="h-full bg-orange-500 transition-all duration-200"
                  style={{ width: `${streamProgressPct}%` }}
                />
              </div>
              <span className="font-mono tabular-nums">{streamProgressPct}%</span>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-zinc-400">Live Trend</h3>
              <FcuLiveTrendChart rows={session.rows} index={session.index} />
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/30 px-3 pb-3 pt-5">
              <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span>Timeline</span>
                  {!isLive && (
                    <button
                      type="button"
                      onClick={onJumpToLive}
                      className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500/20"
                    >
                      <Rewind className="h-2.5 w-2.5 rotate-180" />
                      Return to live
                    </button>
                  )}
                </span>
                <span className="font-mono text-zinc-300">
                  {cur?.time || "—"}
                </span>
              </div>

              <TimelineSlider
                value={session.index}
                max={latestMax}
                onSeek={onSeek}
                viewPct={viewPct}
              />

              <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>{session.rows[0]?.time ?? "Start"}</span>
                <span
                  className={cn(
                    "transition-colors",
                    isLive ? "text-red-400" : "text-zinc-400"
                  )}
                >
                  Drag backward to review history
                </span>
                <span>{latestRow?.time ?? "—"}</span>
              </div>
            </div>

            <Separator className="bg-zinc-800" />

            <div>
              <h3 className="mb-3 text-sm font-medium text-zinc-400">
                Current Stats
              </h3>
              <FcuCurrentReading row={cur} prevRow={prev} />
            </div>
          </div>

          <aside className="flex min-h-0 flex-col border-t border-zinc-800 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-3">
              <div>
                <h3 className="text-sm font-medium text-zinc-300">Live Log</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Most recent telemetry first
                </p>
              </div>
              <LiveChip
                isLive={isLive}
                streamEnded={session.latestIndex >= session.rows.length - 1}
                compact
              />
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
              {recentRows.map((row, i) => {
                const rowIndex = session.latestIndex - i;
                const isViewed = rowIndex === session.index;
                const isLiveHead = i === 0;
                return (
                  <div
                    key={`${row.time}-${rowIndex}`}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs transition-colors",
                      isViewed
                        ? "border-orange-400/50 bg-orange-500/10 text-zinc-100"
                        : isLiveHead
                          ? "border-red-500/30 bg-red-500/5 text-zinc-200"
                          : "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex items-center gap-1.5 truncate font-mono">
                        {isLiveHead && (
                          <span className="relative inline-flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                          </span>
                        )}
                        {row.time}
                      </span>
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
                    <div className="mt-1 font-mono text-[11px] text-zinc-500">
                      SAT {row.supplyAirTemp !== null ? row.supplyAirTemp.toFixed(2) : "—"}°C · RAT{" "}
                      {row.returnTemp !== null ? row.returnTemp.toFixed(2) : "—"}°C
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function LiveChip({
  isLive,
  streamEnded,
  compact,
}: {
  isLive: boolean;
  streamEnded?: boolean;
  compact?: boolean;
}) {
  if (streamEnded && isLive) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/60 px-2 py-0.5 font-mono uppercase tracking-wider text-zinc-400",
          compact ? "text-[9px]" : "text-[10px]"
        )}
      >
        <Radio className="h-2.5 w-2.5" />
        Stream idle
      </span>
    );
  }
  if (isLive) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 font-mono font-semibold uppercase tracking-[0.2em] text-red-300",
          compact ? "text-[9px]" : "text-[10px]"
        )}
      >
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
        </span>
        Live
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono font-semibold uppercase tracking-[0.2em] text-amber-300",
        compact ? "text-[9px]" : "text-[10px]"
      )}
    >
      <Rewind className="h-2.5 w-2.5" />
      Replay
    </span>
  );
}

interface TimelineSliderProps {
  value: number;
  max: number;
  viewPct: number;
  onSeek: (value: number) => void;
}

function TimelineSlider({ value, max, viewPct, onSeek }: TimelineSliderProps) {
  return (
    <div className="relative pt-4">
      {/* "LIVE" label pinned above the right edge */}
      <div className="pointer-events-none absolute -top-0.5 right-0 flex flex-col items-end">
        <span className="rounded-full border border-red-500/40 bg-red-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.35)]">
          Live
        </span>
      </div>

      <div className="relative h-4">
        {/* Background track */}
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-zinc-800" />
        {/* Progress fill to viewed position */}
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-orange-500 transition-all duration-200"
          style={{ width: `${viewPct}%` }}
        />
        {/* Pulsing live dot pinned at far right */}
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.55)]" />
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Scrub historical telemetry"
          className="fcu-timeline-range absolute inset-0 h-4 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>

      <style jsx>{`
        .fcu-timeline-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #fafafa;
          border: 2px solid #f97316;
          box-shadow: 0 0 0 2px rgba(15, 15, 15, 0.9);
          cursor: grab;
        }
        .fcu-timeline-range::-webkit-slider-thumb:active {
          cursor: grabbing;
        }
        .fcu-timeline-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #fafafa;
          border: 2px solid #f97316;
          box-shadow: 0 0 0 2px rgba(15, 15, 15, 0.9);
          cursor: grab;
        }
        .fcu-timeline-range::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
