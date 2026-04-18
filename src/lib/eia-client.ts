import { EiaDataPoint } from "./types";
import { EIA_CONFIG } from "./constants";
import { subHours, format } from "date-fns";

export async function fetchEiaData(): Promise<EiaDataPoint[]> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) throw new Error("EIA_API_KEY not set");

  const now = new Date();
  const start = subHours(now, EIA_CONFIG.LOOKBACK_HOURS);
  const fmt = (d: Date) => format(d, "yyyy-MM-dd") + "T" + format(d, "HH");

  const params = new URLSearchParams({
    api_key: apiKey,
    frequency: "hourly",
    "data[0]": "value",
    "facets[respondent][]": EIA_CONFIG.RESPONDENT,
    "facets[type][]": EIA_CONFIG.TYPE,
    start: fmt(start),
    end: fmt(now),
    "sort[0][column]": "period",
    "sort[0][direction]": "asc",
    length: "200",
  });

  const res = await fetch(
    `${EIA_CONFIG.BASE_URL}/electricity/rto/region-data/data/?${params.toString()}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error(`EIA API error: ${res.status}`);

  const json = await res.json();
  return json?.response?.data ?? [];
}

export function computeLoadFactors(dataPoints: EiaDataPoint[]): number[] {
  const values = dataPoints.map((d) => parseFloat(d.value)).filter((v) => !isNaN(v) && v > 0);
  if (values.length === 0) return Array(168).fill(1);

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return values.map((v) => v / avg);
}

export function generateSyntheticLoadFactors(hours: number): number[] {
  const factors: number[] = [];
  for (let i = 0; i < hours; i++) {
    const hour = i % 24;
    // Diurnal pattern: lower at night, peak afternoon
    const base = 0.75 + 0.35 * Math.sin(((hour - 6) / 24) * 2 * Math.PI);
    // Small deterministic variation
    const noise = 1 + 0.05 * Math.sin(i * 0.7 + 1.3);
    factors.push(Math.max(0.5, base * noise));
  }
  return factors;
}
