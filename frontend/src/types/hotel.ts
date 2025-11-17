import type { BaseEntity, PagedResponse } from "./common";
import type { Review } from "./review";
import type { RoomType } from "./roomType";

export interface Hotel extends BaseEntity {
  name: string;
  city: string;
  address: string;
  rating?: number;
  description?: string;
  thumbnailUrl?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  checkInTime?: string;
  checkOutTime?: string;
  managerId: string;
  roomTypes: RoomType[];
  reviews: Review[];
}

export interface SearchFilters {
  city?: string;
  name?: string;
  address?: string;
  description?: string;
  checkIn?: string;
  checkOut?: string;
  managerId?: string;
  minRating?: number;
  maxPrice?: number;
  isActive?: boolean;
  guests?: number;
}

export type GetAllHotelsResponse = PagedResponse<Hotel>;
