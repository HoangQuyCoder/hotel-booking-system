import type { BaseRateResponse, DailyOverrideResponse } from "../types";

export function getCurrentPrice(
  baseRates: BaseRateResponse[],
  dailyOverrides: DailyOverrideResponse[] = [],
  date: Date = new Date(),
): number {
  const today = date.toISOString().split("T")[0]; // YYYY-MM-DD

  const override = dailyOverrides.find((o) => o.date === today);
  if (override) return override.priceAdjustment;

  const activeRate = baseRates.find((rate) => {
    return rate.startDate <= today && today <= rate.endDate;
  });

  return activeRate?.basePrice ?? 0;
}

/**
 * Calculate total price for multiple days
 */
export function calculateTotalPrice(
  baseRates: BaseRateResponse[],
  dailyOverrides: DailyOverrideResponse[],
  checkIn: string,
  checkOut: string,
): { total: number; breakdown: { date: string; price: number }[] } {
  const breakdown: { date: string; price: number }[] = [];
  let total = 0;

  if (!checkIn || !checkOut) return { total: 0, breakdown: [] };

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  for (let i = 0; i < nights; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    const ds = cur.toISOString().split("T")[0];
    const price = getCurrentPrice(baseRates, dailyOverrides, cur);
    breakdown.push({ date: ds, price });
    total += price;
  }

  return { total, breakdown };
}
