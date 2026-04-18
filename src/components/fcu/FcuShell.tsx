"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FcuRow, parseFcuCsv } from "@/lib/fcu";
import { FcuUpload } from "./FcuUpload";
import { FcuCurrentReading } from "./FcuCurrentReading";
import { FcuLiveFeed } from "./FcuLiveFeed";
import { FcuAlertBanner } from "./FcuAlertBanner";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Gauge } from "lucide-react";

const FEED_SIZE = 30;
const SPEED_OPTIONS = [1, 5, 10, 20] as const;

interface Alert {
  label: string;
  time: string;
  key: number;
}

export function FcuShell() {
  const [rows, setRows] = useState<FcuRow[] | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(5);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [feed, setFeed] = useState<FcuRow[]>([]);

  const rowsRef = useRef<FcuRow[]>([]);
  const indexRef = useRef(0);
  const prevLabelRef = useRef("Normal condition");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alertKeyRef = useRef(0);

  useEffect(() => { indexRef.current = index; }, [index]);

  const tick = useCallback(() => {
    const allRows = rowsRef.current;
    const cur = indexRef.current;
    if (cur >= allRows.length - 1) {
      setPlaying(false);
      return;
    }
    const next = cur + 1;
    const row = allRows[next];

    // Fire alert on any fault transition
    if (row.status !== "normal" && row.label !== prevLabelRef.current) {
      alertKeyRef.current += 1;
      setAlert({ label: row.label, time: row.time, key: alertKeyRef.current });
    }
    prevLabelRef.current = row.label;

    setIndex(next);
    setFeed((prev) => [...prev.slice(-(FEED_SIZE - 1)), row]);
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speed, tick]);

  function handleParsed(text: string) {
    const parsed = parseFcuCsv(text);
    rowsRef.current = parsed;
    setRows(parsed);
    setIndex(0);
    setFeed([parsed[0]]);
    setPlaying(false);
    prevLabelRef.current = "Normal condition";
  }

  function reset() {
    setPlaying(false);
    setIndex(0);
    setFeed(rows ? [rows[0]] : []);
    prevLabelRef.current = "Normal condition";
    setAlert(null);
  }

  if (!rows) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <p className="text-zinc-400 text-sm mb-6">
          Upload a CSV to start the live replay. Data will stream in real time at your chosen speed.
        </p>
        <FcuUpload onParsed={handleParsed} />
      </div>
    );
  }

  const currentRow = rows[index];
  const prevRow = index > 0 ? rows[index - 1] : null;
  const progress = rows.length > 1 ? (index / (rows.length - 1)) * 100 : 0;
  const isFinished = index >= rows.length - 1;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* LIVE indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${playing ? "bg-red-500 animate-pulse" : "bg-zinc-600"}`} />
          <span className={`text-xs font-bold tracking-widest ${playing ? "text-red-400" : "text-zinc-500"}`}>
            {playing ? "LIVE" : isFinished ? "END" : "PAUSED"}
          </span>
        </div>

        <div className="h-4 w-px bg-zinc-700" />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPlaying((p) => !p)}
            disabled={isFinished}
            className="bg-zinc-900 border-zinc-700 text-zinc-200 h-8 w-8 p-0"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            className="bg-zinc-900 border-zinc-700 text-zinc-400 h-8 w-8 p-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-900 p-0.5">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                speed === s
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
          <Gauge className="h-3.5 w-3.5" />
          <span>{index + 1} / {rows.length}</span>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => { setRows(null); reset(); }}
          className="text-zinc-600 hover:text-zinc-400 text-xs h-7"
        >
          New file
        </Button>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Alert banner */}
      <FcuAlertBanner
        key={alert?.key}
        alert={alert}
        onDismiss={() => setAlert(null)}
      />

      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FcuCurrentReading row={currentRow} prevRow={prevRow} />
        </div>
        <div>
          <FcuLiveFeed feed={feed} />
        </div>
      </div>
    </div>
  );
}
