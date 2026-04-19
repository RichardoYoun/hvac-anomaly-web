import { DashboardShell } from "@/components/dashboard/DashboardShell";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="px-2 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Image
              src="/powersense-logo.png"
              alt="PowerSense logo"
              width={114}
              height={50}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100">PowerSense</h1>
            <p className="text-xs text-zinc-500">HVAC &amp; Electrical Anomaly Detection — Building A</p>
          </div>
        </div>
        <DashboardShell />
      </div>
    </main>
  );
}
