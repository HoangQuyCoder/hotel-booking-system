import type { BaseEntity, BaseFilterRequest } from "./common";

export interface PromotionResponse extends BaseEntity {
  code: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  maxUses: number;
  usedCount: number;
  minBookingAmount: number;
}

export interface PromotionRequest {
  code: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  maxUses: number;
  minBookingAmount: number;
}

export interface PromotionFilterRequest extends BaseFilterRequest {
  code?: string;
  validFrom?: string;
  validTo?: string;
  minBookingAmount?: number;
}