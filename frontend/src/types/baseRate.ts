import type { BaseEntity, BaseFilterRequest } from "./common";

export interface BaseRateResponse extends BaseEntity {
  basePrice: number;
  startDate: string;
  endDate: string;
}

export interface BaseRateRequest {
  roomTypeId: string;
  basePrice: number;
  startDate: string;
  endDate: string;
}


export interface BaseRateFilterRequest extends BaseFilterRequest {
  roomTypeId?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: string;
  endDate?: string;
}