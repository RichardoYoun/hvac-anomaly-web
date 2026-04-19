"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FcuRow, parseFcuCsv } from "@/lib/fcu";
import { FcuCurrentReading } from "./FcuCurrentReading";
import { FcuLiveFeed } from "./FcuLiveFeed";
import { FcuAlertBanner } from "./FcuAlertBanner";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Upload, FileText, Gauge } from "lucide-react";

const FEED_SIZE = 30;
const SPEED_OPTIONS = [1, 5, 10, 20] as const;

interface Alert {
  label: string;
  time: string;
  key: number;
}

export function FcuShell() {
  const [rows, setRows] = useState<FcuRow[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(5);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [feed, setFeed] = useState<FcuRow[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  function loadFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseFcuCsv(text);
      rowsRef.current = parsed;
      setRows(parsed);
      setFileName(file.name);
      setIndex(0);
      setFeed([parsed[0]]);
      setPlaying(false);
      setAlert(null);
      prevLabelRef.current = "Normal condition";
    };
    reader.readAsText(file);
  }

  function reset() {
    setPlaying(false);
    setIndex(0);
    setFeed(rows ? [rows[0]] : []);
    prevLabelRef.current = "Normal condition";
    setAlert(null);
  }

  const currentRow = rows?.[index] ?? null;
  const prevRow = rows && index > 0 ? rows[index - 1] : null;
  const progress = rows && rows.length > 1 ? (index / (rows.length - 1)) * 100 : 0;
  const isFinished = rows ? index >= rows.length - 1 : false;

  return (
    <div className="space-y-4">
      {/* Control bar — always visible */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition-colors"
        >
          <Upload className="h-3.5 w-3.5 text-zinc-400" />
          {fileName ? (
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-orange-400" />
              <span className="max-w-[140px] truncate text-orange-300 text-xs">{fileName}</span>
            </span>
          ) : (
            <span className="text-zinc-400">Upload CSV</span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) loadFile(f); e.target.value = ""; }}
        />

        <div className="h-4 w-px bg-zinc-700" />

        {/* LIVE indicator */}
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${playing ? "bg-red-500 animate-pulse" : "bg-zinc-600"}`} />
          <span className={`text-xs font-bold tracking-widest ${playing ? "text-red-400" : "text-zinc-500"}`}>
            {playing ? "LIVE" : isFinished ? "END" : rows ? "PAUSED" : "NO DATA"}
          </span>
        </div>

        {/* Play / Reset */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPlaying((p) => !p)}
            disabled={!rows || isFinished}
            className="bg-zinc-800 border-zinc-700 text-zinc-200 h-8 w-8 p-0 disabled:opacity-30"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            disabled={!rows}
            className="bg-zinc-800 border-zinc-700 text-zinc-400 h-8 w-8 p-0 disabled:opacity-30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-0.5 rounded-md border border-zinc-700 bg-zinc-800 p-0.5">
          {SPEED_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              disabled={!rows}
              className={`px-2.5 py-1 text-xs rounded font-medium transition-colors disabled:opacity-30 ${
                speed === s ? "bg-zinc-600 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        {/* Row counter */}
        {rows && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-500">
            <Gauge className="h-3.5 w-3.5" />
            <span>{index + 1} / {rows.length}</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Alert banner */}
      <FcuAlertBanner key={alert?.key} alert={alert} onDismiss={() => setAlert(null)} />

      {/* Empty state */}
      {!rows && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-800 py-20 cursor-pointer hover:border-zinc-600 transition-colors"
        >
          <div className="p-3 rounded-full bg-zinc-800">
            <Upload className="h-6 w-6 text-zinc-500" />
          </div>
          <p className="text-zinc-400 text-sm">Upload a CSV to begin</p>
          <p className="text-zinc-600 text-xs">Time · Set point temp · Return temp · Supply air · Fan · Valve · Cooling temps</p>
        </div>
      )}

      {/* Live content */}
      {rows && currentRow && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FcuCurrentReading row={currentRow} prevRow={prevRow} />
          </div>
          <div>
            <FcuLiveFeed feed={feed} />
          </div>
        </div>
      )}
    </div>
  );
}
