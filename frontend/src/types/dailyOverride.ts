import type { BaseEntity } from "./common";

export interface DailyOverride extends BaseEntity {
  date: string;
  priceAdjustment: number;
}
