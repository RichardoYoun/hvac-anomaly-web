"use client";

import { useState } from "react";
import { FcuRow, parseFcuCsv, computeFcuStats } from "@/lib/fcu";
import { FcuUpload } from "./FcuUpload";
import { FcuSummaryCards } from "./FcuSummaryCards";
import { FcuTable } from "./FcuTable";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export function FcuShell() {
  const [rows, setRows] = useState<FcuRow[] | null>(null);
  const [fileName, setFileName] = useState("");

  function handleParsed(text: string, name: string) {
    const parsed = parseFcuCsv(text);
    setRows(parsed);
    setFileName(name);
  }

  if (!rows) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <p className="text-zinc-400 text-sm mb-6">
          Upload a CSV with FCU sensor readings to analyze fault conditions across all timesteps.
        </p>
        <FcuUpload onParsed={handleParsed} />
      </div>
    );
  }

  const stats = computeFcuStats(rows);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <FcuSummaryCards stats={stats} fileName={fileName} />
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setRows(null); setFileName(""); }}
          className="bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-zinc-200 shrink-0 self-start"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          New file
        </Button>
      </div>

      <FcuTable rows={rows} />
    </div>
  );
}
