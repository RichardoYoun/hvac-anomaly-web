"use client";

import { useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FcuUploadProps {
  onParsed: (text: string, fileName: string) => void;
}

export function FcuUpload({ onParsed }: FcuUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      onParsed(text, file.name);
    };
    reader.readAsText(file);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) readFile(file);
      }}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors",
        dragging
          ? "border-orange-500 bg-orange-500/5"
          : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/50"
      )}
    >
      <div className="p-4 rounded-full bg-zinc-800">
        <Upload className="h-8 w-8 text-zinc-400" />
      </div>
      <div className="text-center">
        <p className="text-zinc-200 font-medium">Drop your CSV file here</p>
        <p className="text-zinc-500 text-sm mt-1">or click to browse</p>
      </div>
      <div className="text-xs text-zinc-600 text-center max-w-sm">
        Expected columns: Time · Set point temperature · Return temperature · Supply air temperature · Supply fan · Valve position · Heating supply temperature1 · Heating supply temperature2 · Cooling supply temperature 1 · Cooling supply temperature 2
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
        <FileText className="h-3 w-3" />
        <span>.csv format</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
        }}
      />
    </div>
  );
}
