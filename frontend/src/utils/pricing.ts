import type { BaseRate, DailyOverride } from "../types";

export function getPriceForDate(
  baseRates: BaseRate[],
  dailyOverrides: DailyOverride[],
  dateStr: string
): number {
  // override
  const ov = dailyOverrides.find((o) => o.date === dateStr);
  if (ov) return ov.priceAdjustment;

  // base rate
  const br = baseRates.find(
    (r) => r.startDate <= dateStr && dateStr <= r.endDate
  );
  return br?.basePrice ?? 0;
}

/**
 * Calculate total price for multiple days
 */
export function calculateTotalPrice(
  baseRates: BaseRate[],
  dailyOverrides: DailyOverride[],
  checkIn: string,
  checkOut: string
): { total: number; breakdown: { date: string; price: number }[] } {
  const breakdown: { date: string; price: number }[] = [];
  let total = 0;

  if (!checkIn || !checkOut) return { total: 0, breakdown: [] };

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  for (let i = 0; i < nights; i++) {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    const ds = cur.toISOString().split("T")[0];
    const price = getPriceForDate(baseRates, dailyOverrides, ds);
    breakdown.push({ date: ds, price });
    total += price;
  }

  return { total, breakdown };
}
