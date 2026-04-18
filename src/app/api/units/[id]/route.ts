import { NextRequest, NextResponse } from "next/server";
import { fetchEiaData, computeLoadFactors, generateSyntheticLoadFactors } from "@/lib/eia-client";
import { generateUnits, generateReadings } from "@/lib/seed";
import { computeBaseline, scoreReading } from "@/lib/anomaly";
import { EIA_CONFIG } from "@/lib/constants";
import { subHours } from "date-fns";
import { UnitDetail } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let loadFactors: number[];
  try {
    const eiaData = await fetchEiaData();
    loadFactors = eiaData.length >= 24
      ? computeLoadFactors(eiaData)
      : generateSyntheticLoadFactors(EIA_CONFIG.LOOKBACK_HOURS);
  } catch {
    loadFactors = generateSyntheticLoadFactors(EIA_CONFIG.LOOKBACK_HOURS);
  }

  while (loadFactors.length < EIA_CONFIG.LOOKBACK_HOURS) loadFactors.unshift(loadFactors[0] ?? 1);
  loadFactors = loadFactors.slice(-EIA_CONFIG.LOOKBACK_HOURS);

  const units = generateUnits();
  const unit = units.find((u) => u.id === id);
  if (!unit) return NextResponse.json({ error: "Unit not found" }, { status: 404 });

  const startTime = subHours(new Date(), EIA_CONFIG.LOOKBACK_HOURS);
  const allReadings = generateReadings(unit, loadFactors, startTime);

  const baseline = computeBaseline(allReadings);
  const last24 = allReadings.slice(-24);
  const scores = last24.map((r) => {
    const bp = baseline.find((b) => b.hour === new Date(r.timestamp).getUTCHours()) ?? baseline[0];
    return scoreReading(r, bp);
  });

  const detail: UnitDetail = { unit, readings: last24, baseline, scores };
  return NextResponse.json(detail);
}
