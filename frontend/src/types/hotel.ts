export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  rating?: number;
  description?: string;
  thumbnailUrl?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  contactEmail?: string;
  checkInTime?: string;
  checkOutTime?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  managerId: string;
  // roomTypes?: RoomType[];
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

export interface HotelResponse {
  content: Hotel[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
