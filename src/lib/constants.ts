export const ANOMALY_THRESHOLDS = {
  WARNING_MULTIPLIER: 1.15,
  CRITICAL_MULTIPLIER: 1.30,
  BASELINE_WINDOW_DAYS: 7,
};

export const EIA_CONFIG = {
  RESPONDENT: "CISO",
  TYPE: "D",
  BASE_URL: "https://api.eia.gov/v2",
  LOOKBACK_HOURS: 168,
};

export const BUILDING_CONFIG = {
  SUITES: ["1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B"],
  ACS_PER_SUITE: 2,
  CAPACITY_RANGE: [1.2, 4.8] as [number, number],
};

export const SEEDED_ANOMALIES: Record<string, "warning" | "critical"> = {
  "suite-3A-ac-1": "critical",
  "suite-4B-ac-2": "warning",
  "suite-6A-ac-1": "warning",
};
