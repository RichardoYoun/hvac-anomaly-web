"use client";

import { Badge } from "@/components/ui/badge";
import { UnitStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: UnitStatus }) {
  switch (status) {
    case "critical":
      return <Badge className="bg-red-600 text-white hover:bg-red-600">Critical</Badge>;
    case "warning":
      return <Badge className="bg-yellow-600 text-white hover:bg-yellow-600">Warning</Badge>;
    case "normal":
      return <Badge variant="outline" className="text-green-400 border-green-700">Normal</Badge>;
    default:
      return <Badge variant="outline" className="text-zinc-500 border-zinc-700">Offline</Badge>;
  }
}
