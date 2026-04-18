import { AcUnit, AnomalyScore, BaselinePoint, Reading, UnitSummary } from "./types";
import { ANOMALY_THRESHOLDS } from "./constants";

export function computeBaseline(readings: Reading[]): BaselinePoint[] {
  const buckets: Record<number, number[]> = {};
  for (let h = 0; h < 24; h++) buckets[h] = [];

  for (const r of readings) {
    const hour = new Date(r.timestamp).getUTCHours();
    buckets[hour].push(r.actualKwh);
  }

  return Array.from({ length: 24 }, (_, h) => {
    const vals = buckets[h];
    if (vals.length === 0) return { hour: h, avgKwh: 0, stdDev: 0 };
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const variance = vals.reduce((a, b) => a + (b - avg) ** 2, 0) / vals.length;
    return { hour: h, avgKwh: Math.round(avg * 100) / 100, stdDev: Math.round(Math.sqrt(variance) * 100) / 100 };
  });
}

export function scoreReading(reading: Reading, baseline: BaselinePoint): AnomalyScore {
  const { avgKwh, stdDev } = baseline;
  const pctDeviation = avgKwh > 0 ? ((reading.actualKwh - avgKwh) / avgKwh) * 100 : 0;
  const zScore = stdDev > 0 ? (reading.actualKwh - avgKwh) / stdDev : 0;

  let status: AnomalyScore["status"] = "normal";
  if (reading.actualKwh > avgKwh * ANOMALY_THRESHOLDS.CRITICAL_MULTIPLIER) {
    status = "critical";
  } else if (reading.actualKwh > avgKwh * ANOMALY_THRESHOLDS.WARNING_MULTIPLIER) {
    status = "warning";
  }

  return {
    unitId: reading.unitId,
    timestamp: reading.timestamp,
    actualKwh: reading.actualKwh,
    baselineKwh: avgKwh,
    pctDeviation: Math.round(pctDeviation * 10) / 10,
    status,
    zScore: Math.round(zScore * 100) / 100,
  };
}

export function scoreAllUnits(
  units: AcUnit[],
  readingsByUnit: Record<string, Reading[]>
): UnitSummary[] {
  return units.map((unit) => {
    const readings = readingsByUnit[unit.id] ?? [];
    const baseline = computeBaseline(readings);

    const last24 = readings.slice(-24);
    const scores = last24.map((r) => {
      const bp = baseline.find((b) => b.hour === new Date(r.timestamp).getUTCHours()) ?? baseline[0];
      return scoreReading(r, bp);
    });

    const latestScore = scores[scores.length - 1] ?? {
      unitId: unit.id,
      timestamp: new Date().toISOString(),
      actualKwh: 0,
      baselineKwh: 0,
      pctDeviation: 0,
      status: "offline" as const,
      zScore: 0,
    };

    const prevScore = scores[scores.length - 2];
    let trend: UnitSummary["trend"] = "stable";
    if (prevScore) {
      const diff = latestScore.pctDeviation - prevScore.pctDeviation;
      if (diff > 1) trend = "up";
      else if (diff < -1) trend = "down";
    }

    const alertCount24h = scores.filter((s) => s.status === "warning" || s.status === "critical").length;

    return { unit, latestScore, trend, alertCount24h };
  });
}
