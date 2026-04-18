export type UnitStatus = "normal" | "warning" | "critical" | "offline";

export interface AcUnit {
  id: string;
  suite: string;
  acNumber: number;
  label: string;
  ratedCapacityKw: number;
  installDate: string;
}

export interface Reading {
  unitId: string;
  timestamp: string;
  actualKwh: number;
  isSimulated: boolean;
}

export interface BaselinePoint {
  hour: number;
  avgKwh: number;
  stdDev: number;
}

export interface AnomalyScore {
  unitId: string;
  timestamp: string;
  actualKwh: number;
  baselineKwh: number;
  pctDeviation: number;
  status: UnitStatus;
  zScore: number;
}

export interface UnitSummary {
  unit: AcUnit;
  latestScore: AnomalyScore;
  trend: "up" | "down" | "stable";
  alertCount24h: number;
}

export interface UnitDetail {
  unit: AcUnit;
  readings: Reading[];
  baseline: BaselinePoint[];
  scores: AnomalyScore[];
}

export interface EiaDataPoint {
  period: string;
  respondent: string;
  type: string;
  value: string;
  "value-units": string;
}

export interface EiaApiResponse {
  response: { data: EiaDataPoint[]; total: string };
}
