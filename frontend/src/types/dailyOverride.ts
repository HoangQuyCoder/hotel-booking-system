import type { BaseEntity, BaseFilterRequest } from "./common";

export interface DailyOverrideResponse extends BaseEntity {
  date: string;
  priceAdjustment: number;
  availableRooms: number;
  reason: string;
}

export interface DailyOverrideRequest {
  roomTypeId: string;
  date: string;
  priceAdjustment: number;
  availableRooms: number;
  reason?: string;
}

export interface DailyOverrideFilterRequest extends BaseFilterRequest {
  roomTypeId?: string;
  fromDate?: string;
  toDate?: string;
  minPriceAdjustment?: number;
  maxPriceAdjustment?: number;
  minAvailableRooms?: number;
  maxAvailableRooms?: number;
}