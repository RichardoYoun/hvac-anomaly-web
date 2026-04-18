import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <Zap className="h-5 w-5 text-orange-500" />
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
