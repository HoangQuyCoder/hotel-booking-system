import type { BaseEntity, PagedResponse } from "./common";

export interface Hotel extends BaseEntity {
  name: string;
  city: string;
  address: string;
  rating?: number;
  description?: string;
  thumbnailUrl?: string;
  images?: string[];
  reviews?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  checkInTime?: string;
  checkOutTime?: string;
  managerId: string;
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
