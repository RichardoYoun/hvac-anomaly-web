export interface FcuSession {
  id: string;
  unitName: string;
  fileName: string;
  rows: FcuRow[];
  /** Row the user is currently viewing. Equals latestIndex when tracking live. */
  index: number;
  /** Most recent row received from the simulated live feed. */
  latestIndex: number;
}

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

function normalizeToken(v: string): string {
  return v.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function splitDelimitedLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function detectDelimiter(lines: string[]): string {
  const candidates = [",", ";", "\t", "|"];
  const sampleLine = lines.find((line) => line.trim().length > 0) ?? "";
  if (!sampleLine) return ",";

  let best = ",";
  let bestCount = -1;
  for (const candidate of candidates) {
    const count = (sampleLine.match(new RegExp(`\\${candidate}`, "g")) ?? []).length;
    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }
  return best;
}

function parseNum(v: string): number | null {
  const raw = v.trim();
  if (!raw) return null;

  const lowered = raw.toLowerCase();
  if (["true", "on", "open", "yes", "y", "active"].includes(lowered)) return 1;
  if (["false", "off", "closed", "no", "n", "inactive"].includes(lowered)) return 0;

  const cleaned = raw.replace(/[^0-9+\-.]/g, "");
  if (!cleaned || cleaned === "+" || cleaned === "-" || cleaned === ".") return null;
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

function labelToStatus(label: string): FcuStatus {
  const normalized = label.toLowerCase();
  if (normalized.includes("normal") || normalized.includes("ok")) return "normal";
  if (
    normalized.includes("supply fan") ||
    normalized.includes("valve") ||
    normalized.includes("critical") ||
    normalized.includes("alarm")
  ) {
    return "critical";
  }
  return "warning";
}

function parseStatus(rawStatus: string, label: string): FcuStatus {
  const normalized = rawStatus.toLowerCase();
  if (
    normalized.includes("critical") ||
    normalized.includes("alarm") ||
    normalized.includes("high")
  ) {
    return "critical";
  }
  if (normalized.includes("warn") || normalized.includes("medium")) return "warning";
  if (normalized.includes("normal") || normalized.includes("ok") || normalized.includes("low")) {
    return "normal";
  }
  return labelToStatus(label);
}

const HEADER_ALIASES: Record<string, string[]> = {
  time: ["time", "timestamp", "datetime", "date", "eventtime"],
  setPointTemp: ["setpoint", "setpointtemp", "setpointtemperature", "targettemp", "targettemperature"],
  returnTemp: ["returntemp", "returntemperature", "returnairtemp", "returnairtemperature", "rat"],
  supplyAirTemp: ["supplyairtemp", "supplyairtemperature", "sat", "supplytemp", "supplytemperature"],
  supplyFan: ["supplyfan", "fan", "fanstatus", "fanspeed", "supplyfanstatus"],
  valvePosition: ["valveposition", "valve", "valvepercent", "valvepct", "valveopening"],
  heatingSupplyTemp1: ["heatingsupplytemp1", "hst1", "heatingtemp1"],
  heatingSupplyTemp2: ["heatingsupplytemp2", "hst2", "heatingtemp2"],
  coolingSupplyTemp1: ["coolingsupplytemp1", "cst1", "coolingtemp1"],
  coolingSupplyTemp2: ["coolingsupplytemp2", "cst2", "coolingtemp2"],
  label: ["label", "fault", "faultlabel", "faulttype", "anomaly", "condition", "event"],
  status: ["status", "severity", "state", "alertlevel"],
};

function inferLabel(rawLabel: string, status: string): string {
  if (rawLabel.trim()) return rawLabel.trim();
  if (!status.trim()) return "Unknown condition";
  const normalizedStatus = status.trim().toLowerCase();
  if (normalizedStatus.includes("normal") || normalizedStatus.includes("ok")) return "Normal condition";
  return `${status.trim()} condition`;
}

function getColumnIndex(normalizedHeader: string, key: keyof typeof HEADER_ALIASES): boolean {
  return HEADER_ALIASES[key].includes(normalizedHeader);
}

function getCol(cols: string[], indexMap: Partial<Record<keyof typeof HEADER_ALIASES, number>>, key: keyof typeof HEADER_ALIASES): string {
  const idx = indexMap[key];
  if (idx === undefined) return "";
  return cols[idx] ?? "";
}

export function parseFcuCsv(text: string): FcuRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  if (lines.length === 0) return [];

  const delimiter = detectDelimiter(lines);
  const firstCols = splitDelimitedLine(lines[0], delimiter);
  const normalizedHeader = firstCols.map(normalizeToken);

  const indexMap: Partial<Record<keyof typeof HEADER_ALIASES, number>> = {};
  normalizedHeader.forEach((header, index) => {
    (Object.keys(HEADER_ALIASES) as Array<keyof typeof HEADER_ALIASES>).forEach((key) => {
      if (getColumnIndex(header, key)) {
        indexMap[key] = index;
      }
    });
  });

  const hasHeader = Object.keys(indexMap).length > 2;
  const dataStart = hasHeader ? 1 : 0;
  const rows: FcuRow[] = [];
  for (let i = dataStart; i < lines.length; i++) {
    const cols = splitDelimitedLine(lines[i], delimiter);
    if (cols.every((col) => col.trim() === "")) continue;

    const rawLabel = hasHeader ? getCol(cols, indexMap, "label") : cols[10] ?? "";
    const rawStatus = hasHeader ? getCol(cols, indexMap, "status") : "";
    const label = inferLabel(rawLabel, rawStatus);
    const status = parseStatus(rawStatus, label);

    rows.push({
      time: hasHeader ? getCol(cols, indexMap, "time") || cols[0] || "" : cols[0]?.trim() ?? "",
      setPointTemp: parseNum(hasHeader ? getCol(cols, indexMap, "setPointTemp") : cols[1] ?? ""),
      returnTemp: parseNum(hasHeader ? getCol(cols, indexMap, "returnTemp") : cols[2] ?? ""),
      supplyAirTemp: parseNum(hasHeader ? getCol(cols, indexMap, "supplyAirTemp") : cols[3] ?? ""),
      supplyFan: parseNum(hasHeader ? getCol(cols, indexMap, "supplyFan") : cols[4] ?? ""),
      valvePosition: parseNum(hasHeader ? getCol(cols, indexMap, "valvePosition") : cols[5] ?? ""),
      heatingSupplyTemp1: parseNum(hasHeader ? getCol(cols, indexMap, "heatingSupplyTemp1") : cols[6] ?? ""),
      heatingSupplyTemp2: parseNum(hasHeader ? getCol(cols, indexMap, "heatingSupplyTemp2") : cols[7] ?? ""),
      coolingSupplyTemp1: parseNum(hasHeader ? getCol(cols, indexMap, "coolingSupplyTemp1") : cols[8] ?? ""),
      coolingSupplyTemp2: parseNum(hasHeader ? getCol(cols, indexMap, "coolingSupplyTemp2") : cols[9] ?? ""),
      label,
      status,
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
