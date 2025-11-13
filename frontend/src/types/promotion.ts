import type { BaseEntity } from "./common";

export interface Promotion extends BaseEntity {
  code: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  maxUses: number;
  usedCount: number;
  minBookingAmount: number;
}
