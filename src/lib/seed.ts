import { AcUnit, Reading } from "./types";
import { BUILDING_CONFIG, SEEDED_ANOMALIES } from "./constants";

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateUnits(): AcUnit[] {
  const units: AcUnit[] = [];
  const [minCap, maxCap] = BUILDING_CONFIG.CAPACITY_RANGE;

  for (const suite of BUILDING_CONFIG.SUITES) {
    for (let ac = 1; ac <= BUILDING_CONFIG.ACS_PER_SUITE; ac++) {
      const id = `suite-${suite}-ac-${ac}`;
      const hash = djb2Hash(id);
      const capacityFraction = seededRandom(hash);
      const ratedCapacityKw = minCap + capacityFraction * (maxCap - minCap);

      // Install dates spread across 2019-2022
      const yearOffset = Math.floor(seededRandom(hash + 1) * 4);
      const monthOffset = Math.floor(seededRandom(hash + 2) * 12);
      const installDate = new Date(2019 + yearOffset, monthOffset, 1).toISOString().split("T")[0];

      units.push({
        id,
        suite,
        acNumber: ac,
        label: `Suite ${suite} — AC #${ac}`,
        ratedCapacityKw: Math.round(ratedCapacityKw * 10) / 10,
        installDate,
      });
    }
  }
  return units;
}

export function generateReadings(
  unit: AcUnit,
  regionalLoadFactors: number[],
  startTime: Date
): Reading[] {
  const readings: Reading[] = [];
  const hash = djb2Hash(unit.id);
  const anomalyType = SEEDED_ANOMALIES[unit.id];

  // Base noise factor unique to this unit
  const baseNoise = 0.85 + seededRandom(hash + 3) * 0.30;

  for (let i = 0; i < regionalLoadFactors.length; i++) {
    const ts = new Date(startTime.getTime() + i * 3600 * 1000);
    const loadFactor = regionalLoadFactors[i];

    // Per-hour micro-variation seeded to unit + hour index
    const hourNoise = 0.92 + seededRandom(hash + i + 100) * 0.16;

    let multiplier = loadFactor * baseNoise * hourNoise;

    // Inject anomaly in the last 24 hours for seeded units
    const isRecentHour = i >= regionalLoadFactors.length - 24;
    if (anomalyType && isRecentHour) {
      const progressFraction = (i - (regionalLoadFactors.length - 24)) / 24;
      if (anomalyType === "critical") {
        multiplier *= 1.30 + progressFraction * 0.15;
      } else {
        multiplier *= 1.15 + progressFraction * 0.08;
      }
    }

    readings.push({
      unitId: unit.id,
      timestamp: ts.toISOString(),
      actualKwh: Math.round(unit.ratedCapacityKw * multiplier * 100) / 100,
      isSimulated: true,
    });
  }
  return readings;
}
