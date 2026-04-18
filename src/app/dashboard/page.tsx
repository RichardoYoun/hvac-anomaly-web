import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FcuShell } from "@/components/fcu/FcuShell";
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

        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="live" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400">
              Live Monitor
            </TabsTrigger>
            <TabsTrigger value="fcu" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-400">
              FCU Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live">
            <DashboardShell />
          </TabsContent>

          <TabsContent value="fcu">
            <FcuShell />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
