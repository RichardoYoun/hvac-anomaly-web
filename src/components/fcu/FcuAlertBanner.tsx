"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  alert: { label: string; time: string } | null;
  onDismiss: () => void;
}

export function FcuAlertBanner({ alert, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [alert]);

  if (!alert) return null;

  return (
    <div
      className={`transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
    >
      <div className="flex items-center gap-3 rounded-lg border border-red-700 bg-red-950/60 px-4 py-3 text-sm">
        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 animate-pulse" />
        <div className="flex-1">
          <span className="font-semibold text-red-300">FAULT DETECTED — </span>
          <span className="text-red-200">{alert.label}</span>
          <span className="text-red-500 ml-2 text-xs">{alert.time}</span>
        </div>
        <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}>
          <X className="h-4 w-4 text-red-500 hover:text-red-300" />
        </button>
      </div>
    </div>
  );
}
