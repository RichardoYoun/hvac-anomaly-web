import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ArrowLeft, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] -z-0 opacity-70"
        style={{
          background:
            "radial-gradient(800px 320px at 30% 0%, rgba(83,58,253,0.18), transparent 60%), radial-gradient(700px 300px at 85% 0%, rgba(253,98,82,0.12), transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-[0_6px_18px_rgba(253,98,82,0.35)]"
              style={{
                background:
                  "linear-gradient(135deg, #ff9014 0%, #fd6252 45%, #f96bee 100%)",
              }}
            >
              <Zap className="h-4.5 w-4.5" strokeWidth={2.2} />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-50">
                PowerSense
              </h1>
              <p className="text-xs text-zinc-500">
                HVAC &amp; Electrical Anomaly Detection · Building A
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-400 md:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live · polling every 60s
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to site
            </Link>
          </div>
        </header>

        <DashboardShell />
      </div>
    </main>
  );
}
