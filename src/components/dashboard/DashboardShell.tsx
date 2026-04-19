"use client";

import { useEffect, useRef, useState } from "react";
import { FcuSession, parseFcuCsv } from "@/lib/fcu";
import { SummaryCards } from "./SummaryCards";
import { UnitsTable } from "./UnitsTable";
import { FcuDetailPanel } from "@/components/fcu/FcuDetailPanel";
import { RefreshCw, Upload } from "lucide-react";

const LIVE_TICK_MS = 1000;

export function DashboardShell() {
  const [selectedFcuId, setSelectedFcuId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fcuSessions, setFcuSessions] = useState<FcuSession[]>([]);
  const [pendingUnitName, setPendingUnitName] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  useEffect(() => {
    const intervals = intervalsRef.current;
    return () => {
      intervals.forEach((iv) => clearInterval(iv));
      intervals.clear();
    };
  }, []);

  function startFcuInterval(sessionId: string) {
    const existing = intervalsRef.current.get(sessionId);
    if (existing) clearInterval(existing);

    const iv = setInterval(() => {
      setLastUpdated(new Date());
      setFcuSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          if (s.latestIndex >= s.rows.length - 1) {
            const current = intervalsRef.current.get(sessionId);
            if (current) {
              clearInterval(current);
              intervalsRef.current.delete(sessionId);
            }
            return s;
          }
          const nextLatest = s.latestIndex + 1;
          const nextIndex = s.index === s.latestIndex ? nextLatest : s.index;
          return { ...s, latestIndex: nextLatest, index: nextIndex };
        })
      );
    }, LIVE_TICK_MS);

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
        latestIndex: 0,
      };
      setFcuSessions((prev) => [...prev, session]);
      setLastUpdated(new Date());
      startFcuInterval(id);
    };
    reader.readAsText(file);
  }

  function seekFcuSession(id: string, targetIndex: number) {
    setFcuSessions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const clamped = Math.max(0, Math.min(targetIndex, s.latestIndex));
        return { ...s, index: clamped };
      })
    );
    setLastUpdated(new Date());
  }

  function jumpFcuToLive(id: string) {
    setFcuSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, index: s.latestIndex } : s))
    );
    setLastUpdated(new Date());
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
        onSelectFcu={(id) => {
          setSelectedFcuId(selectedFcuId === id ? null : id);
        }}
      />

      <FcuDetailPanel
        session={selectedFcuSession}
        onClose={() => setSelectedFcuId(null)}
        onSeek={(index) => {
          if (selectedFcuSession) seekFcuSession(selectedFcuSession.id, index);
        }}
        onJumpToLive={() => {
          if (selectedFcuSession) jumpFcuToLive(selectedFcuSession.id);
        }}
      />
    </div>
  );
}
