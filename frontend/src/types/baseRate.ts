import type { BaseEntity } from "./common";

export interface BaseRate extends BaseEntity {
  basePrice: number;
  startDate: string;
  endDate: string;
}
