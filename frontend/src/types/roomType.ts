import type { BaseRateResponse } from "./baseRate";
import type { BaseEntity, BaseFilterRequest } from "./common";
import type { DailyOverrideResponse } from "./dailyOverride";
import type { RoomResponse } from "./room";
import type { RoomAmenityResponse } from "./roomAmenity";

export interface RoomTypeResponse extends BaseEntity {
  name: string;
  capacity: number;
  sizeSqm: number;
  totalRooms: number;
  description?: string;
  isAvailable: boolean;
  rooms: RoomResponse[];
  amenities: RoomAmenityResponse[];
  baseRates: BaseRateResponse[];
  dailyOverrides: DailyOverrideResponse[];
}

export interface RoomTypeListResponse extends BaseEntity {
  name: string;
  capacity: number;
  sizeSqm: number;
  totalRooms: number;
  description?: string;
  isAvailable: boolean;
  baseRates: BaseRateResponse[];
  dailyOverrides: DailyOverrideResponse[];
}

export interface RoomTypeRequest {
  hotelId: string;
  name: string;
  capacity: number;
  sizeSqm: number;
  totalRooms: number;
  description?: string;
}

export interface RoomTypeUpdateRequest {
  name?: string;
  capacity?: number;
  sizeSqm?: number;
  totalRooms?: number;
  description?: string;
  hotelId: string;
}

export interface RoomTypeFilterRequest extends BaseFilterRequest {
  hotelId?: string;
  name?: string;
  capacity?: number;
  minSize?: number;
  maxSize?: number;
  isAvailable?: boolean;
}
