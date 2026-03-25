import type { BaseEntity, BaseFilterRequest } from "./common";

export interface RoomAmenityResponse extends BaseEntity {
  name: string;
  category: string;
}

export interface RoomAmenityRequest {
  roomTypeId: string;
  name: string;
  category: string;
}

export interface RoomAmenityFilterRequest extends BaseFilterRequest {
  name?: string;
  category?: string;
}
