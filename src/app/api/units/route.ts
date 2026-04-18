import { NextRequest, NextResponse } from "next/server";
import { fetchEiaData, computeLoadFactors, generateSyntheticLoadFactors } from "@/lib/eia-client";
import { generateUnits, generateReadings } from "@/lib/seed";
import { scoreAllUnits } from "@/lib/anomaly";
import { EIA_CONFIG } from "@/lib/constants";
import { subHours } from "date-fns";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const suiteFilter = searchParams.get("suite");
  const acFilter = searchParams.get("acNumber");
  const statusFilter = searchParams.get("status");

  // Fetch real EIA data; fall back to synthetic if unavailable
  let loadFactors: number[];
  try {
    const eiaData = await fetchEiaData();
    loadFactors = eiaData.length >= 24
      ? computeLoadFactors(eiaData)
      : generateSyntheticLoadFactors(EIA_CONFIG.LOOKBACK_HOURS);
  } catch {
    loadFactors = generateSyntheticLoadFactors(EIA_CONFIG.LOOKBACK_HOURS);
  }

  // Pad or trim to exactly LOOKBACK_HOURS entries
  while (loadFactors.length < EIA_CONFIG.LOOKBACK_HOURS) {
    loadFactors.unshift(loadFactors[0] ?? 1);
  }
  loadFactors = loadFactors.slice(-EIA_CONFIG.LOOKBACK_HOURS);

  const units = generateUnits();
  const startTime = subHours(new Date(), EIA_CONFIG.LOOKBACK_HOURS);

  const readingsByUnit: Record<string, ReturnType<typeof generateReadings>> = {};
  for (const unit of units) {
    readingsByUnit[unit.id] = generateReadings(unit, loadFactors, startTime);
  }

  let summaries = scoreAllUnits(units, readingsByUnit);

  if (suiteFilter && suiteFilter !== "all") {
    summaries = summaries.filter((s) => s.unit.suite === suiteFilter);
  }
  if (acFilter && acFilter !== "all") {
    summaries = summaries.filter((s) => String(s.unit.acNumber) === acFilter);
  }
  if (statusFilter && statusFilter !== "all") {
    summaries = summaries.filter((s) => s.latestScore.status === statusFilter);
  }

  // Sort: critical first, then warning, then normal
  const order = { critical: 0, warning: 1, normal: 2, offline: 3 };
  summaries.sort((a, b) => order[a.latestScore.status] - order[b.latestScore.status]);

  return NextResponse.json(summaries);
}
