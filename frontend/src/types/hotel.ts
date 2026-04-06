import type { BaseEntity, BaseFilterRequest } from "./common";
import type { ReviewResponse } from "./review";
import type { RoomTypeResponse } from "./roomType";
import type { ManagerResponse } from "./user";

export interface HotelListResponse extends BaseEntity {
  name: string;
  city: string;
  address: string;
  rating: number;
  description: string;
  thumbnailUrl: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface HotelDetailResponse extends BaseEntity {
  name: string;
  city: string;
  address: string;
  rating: number;
  description: string;
  thumbnailUrl: string;
  images: string[];
  manager: ManagerResponse;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
  checkInTime: string;
  checkOutTime: string;
  roomTypes: RoomTypeResponse[];
  reviews: ReviewResponse[];
}

export interface HotelRequest {
  name: string;
  city: string;
  address: string;
  rating?: number;
  description?: string;
  thumbnailUrl?: string;
  images?: string[];
  managerId: string;
  latitude?: number;
  longitude?: number;
  contactPhone: string;
  contactEmail: string;
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

export interface HotelFilterRequest extends BaseFilterRequest {
  city?: string;
  name?: string;
  address?: string;
  keyword?: string;
  managerId?: string;
  minRating?: number;
  maxRating?: number;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
}
