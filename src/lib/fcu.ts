export type FcuLabel =
  | "Normal condition"
  | "Supply fan fault"
  | "Return air temperature fault"
  | "Supply air temperature fault"
  | "Valve position fault";

export type FcuStatus = "normal" | "warning" | "critical";

export interface FcuRow {
  time: string;
  setPointTemp: number | null;
  returnTemp: number | null;
  supplyAirTemp: number | null;
  supplyFan: number | null;
  valvePosition: number | null;
  heatingSupplyTemp1: number | null;
  heatingSupplyTemp2: number | null;
  coolingSupplyTemp1: number | null;
  coolingSupplyTemp2: number | null;
  label: string;
  status: FcuStatus;
}

export interface FcuSummaryStats {
  total: number;
  byLabel: Record<string, number>;
  faultCount: number;
  normalCount: number;
}

function parseNum(v: string): number | null {
  const n = parseFloat(v.trim());
  return isNaN(n) ? null : n;
}

function labelToStatus(label: string): FcuStatus {
  if (label === "Normal condition") return "normal";
  // Fan fault and valve fault are more critical (equipment failure)
  if (label === "Supply fan fault" || label === "Valve position fault") return "critical";
  return "warning";
}

export function parseFcuCsv(text: string): FcuRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Skip header row
  const rows: FcuRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 11) continue;

    const label = cols[10]?.trim() ?? "Unknown";
    rows.push({
      time: cols[0]?.trim() ?? "",
      setPointTemp: parseNum(cols[1]),
      returnTemp: parseNum(cols[2]),
      supplyAirTemp: parseNum(cols[3]),
      supplyFan: parseNum(cols[4]),
      valvePosition: parseNum(cols[5]),
      heatingSupplyTemp1: parseNum(cols[6]),
      heatingSupplyTemp2: parseNum(cols[7]),
      coolingSupplyTemp1: parseNum(cols[8]),
      coolingSupplyTemp2: parseNum(cols[9]),
      label,
      status: labelToStatus(label),
    });
  }
  return rows;
}

export function computeFcuStats(rows: FcuRow[]): FcuSummaryStats {
  const byLabel: Record<string, number> = {};
  for (const row of rows) {
    byLabel[row.label] = (byLabel[row.label] ?? 0) + 1;
  }
  return {
    total: rows.length,
    byLabel,
    faultCount: rows.filter((r) => r.status !== "normal").length,
    normalCount: rows.filter((r) => r.status === "normal").length,
  };
}
