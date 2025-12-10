import type { BaseEntity, BaseFilterRequest } from "./common";
import type { ReviewResponse } from "./review";
import type { RoomTypeResponse } from "./roomType";

export interface ManagerResponse {
  id: string;
  usename?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface HotelDetailResponse extends BaseEntity {
  name: string;
  city: string;
  address?: string | null;
  rating?: number | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  images?: string[] | null;
  manager?: ManagerResponse | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  roomTypes?: RoomTypeResponse[] | null;
  reviews?: ReviewResponse[] | null;
}

export interface HotelRequest {
  name: string;
  city: string;
  address?: string;
  rating?: number;
  description?: string;
  thumbnailUrl?: string;
  images?: string[];
  managerId?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface HotelUpdateRequest {
  name?: string;
  city?: string;
  address?: string;
  rating?: number;
  description?: string;
  managerId?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  checkInTime?: string;
  checkOutTime?: string;
  thumbnailUrl?: string;
  images?: string[];
}

export interface HotelFilter  extends BaseFilterRequest{
  city?: string;
  name?: string;
  address?: string;
  description?: string;
  checkIn?: string;
  checkOut?: string;
  managerId?: string;
  minRating?: number;
  maxRating?: number;
}