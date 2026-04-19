"use client";

import { useEffect, useState, useRef } from "react";
import { FcuSession, parseFcuCsv } from "@/lib/fcu";
import { SummaryCards } from "./SummaryCards";
import { UnitsTable } from "./UnitsTable";
import { FcuDetailPanel } from "@/components/fcu/FcuDetailPanel";
import { RefreshCw, Upload } from "lucide-react";

export function DashboardShell() {
  const [selectedFcuId, setSelectedFcuId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fcuSessions, setFcuSessions] = useState<FcuSession[]>([]);
  const [pendingUnitName, setPendingUnitName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    const intervals = intervalsRef.current;
    return () => { intervals.forEach((iv) => clearInterval(iv)); };
  }, []);

  function startFcuInterval(sessionId: string, speed: number) {
    const existing = intervalsRef.current.get(sessionId);
    if (existing) clearInterval(existing);

    const iv = setInterval(() => {
      setLastUpdated(new Date());
      setFcuSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          if (s.index >= s.rows.length - 1) {
            clearInterval(intervalsRef.current.get(sessionId)!);
            intervalsRef.current.delete(sessionId);
            return { ...s, playing: false };
          }
          return { ...s, index: s.index + 1 };
        })
      );
    }, 1000 / speed);

    intervalsRef.current.set(sessionId, iv);
  }

  function addFcuSession(file: File, unitName: string) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseFcuCsv(text);
      if (rows.length === 0) return;
      const id = `fcu-${Date.now()}`;
      const session: FcuSession = {
        id,
        unitName: unitName.trim() || file.name.replace(/\.(csv|tsv|txt)$/i, ""),
        fileName: file.name,
        rows,
        index: 0,
        playing: true,
        speed: 5,
      };
      setFcuSessions((prev) => [...prev, session]);
      setLastUpdated(new Date());
      startFcuInterval(id, session.speed);
    };
    reader.readAsText(file);
  }

  function updateFcuSpeed(id: string, speed: number) {
    const normalizedSpeed = Math.min(20, Math.max(1, speed));
    let shouldRestart = false;

    setFcuSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        shouldRestart = s.playing;
        return { ...s, speed: normalizedSpeed };
      })
    );

    if (shouldRestart) {
      startFcuInterval(id, normalizedSpeed);
    }
  }

  function toggleFcuPlayback(id: string) {
    const interval = intervalsRef.current.get(id);
    let nextSession: FcuSession | null = null;

    setFcuSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;

        if (s.playing) {
          if (interval) clearInterval(interval);
          intervalsRef.current.delete(id);
          nextSession = { ...s, playing: false };
          return nextSession;
        }

        const restartIndex = s.index >= s.rows.length - 1 ? 0 : s.index;
        nextSession = { ...s, index: restartIndex, playing: true };
        return nextSession;
      })
    );

    if (nextSession && nextSession.playing) {
      setLastUpdated(new Date());
      startFcuInterval(id, nextSession.speed);
    }
  }

  function seekFcuSession(id: string, targetIndex: number) {
    let shouldRestart = false;
    let speedForRestart = 5;

    setFcuSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const clampedIndex = Math.max(0, Math.min(targetIndex, s.rows.length - 1));
        shouldRestart = s.playing;
        speedForRestart = s.speed;
        return { ...s, index: clampedIndex };
      })
    );

    setLastUpdated(new Date());

    if (shouldRestart) {
      startFcuInterval(id, speedForRestart);
    }
  }

  function removeFcuSession(id: string) {
    const iv = intervalsRef.current.get(id);
    if (iv) clearInterval(iv);
    intervalsRef.current.delete(id);
    setFcuSessions((prev) => prev.filter((s) => s.id !== id));
    if (selectedFcuId === id) setSelectedFcuId(null);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) addFcuSession(file, pendingUnitName);
    e.target.value = "";
  }

  const selectedFcuSession = fcuSessions.find((s) => s.id === selectedFcuId) ?? null;

  return (
    <div className="space-y-6">
      <SummaryCards fcuSessions={fcuSessions} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-zinc-400">
          FCU rows stream live here for central monitoring.
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <RefreshCw className="h-3 w-3" />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Waiting for FCU stream…"}
        </div>
      </div>

      <div className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-zinc-900 px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-orange-300 uppercase tracking-wider">
            FCU Live Hub
          </span>
          <div className="h-4 w-px bg-zinc-700" />
          <span className="text-xs text-zinc-400">
            {fcuSessions.length} stream{fcuSessions.length === 1 ? "" : "s"} active
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="FCU name (e.g. ICU Ward 3)"
          value={pendingUnitName}
          onChange={(e) => setPendingUnitName(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-400 w-56"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-orange-400 transition-colors shadow-sm shadow-orange-900/30"
        >
          <Upload className="h-4 w-4" />
          <span>Upload FCU CSV Log</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.tsv,.txt,text/csv,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />
        </div>
      </div>

      <UnitsTable
        fcuSessions={fcuSessions}
        loading={false}
        selectedFcuId={selectedFcuId}
        onRemoveFcu={removeFcuSession}
        onSelectFcu={(id) => { setSelectedFcuId(selectedFcuId === id ? null : id); }}
      />

      <FcuDetailPanel
        session={selectedFcuSession}
        onClose={() => setSelectedFcuId(null)}
        onTogglePlayback={() => {
          if (selectedFcuSession) toggleFcuPlayback(selectedFcuSession.id);
        }}
        onSeek={(index) => {
          if (selectedFcuSession) seekFcuSession(selectedFcuSession.id, index);
        }}
        onSpeedChange={(speed) => {
          if (selectedFcuSession) updateFcuSpeed(selectedFcuSession.id, speed);
        }}
      />
    </div>
  );
}
