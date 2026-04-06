import type { BaseEntity, BaseFilterRequest } from "./common";

export interface ReviewResponse extends BaseEntity {
  name: string;
  rating: number;
  text: string;
  hotelId: string;
  userId: string;
}

export interface ReviewRequest {
  name: string;
  rating: number;
  text: string;
  hotelId: string;
  userId: string;
}

export interface ReviewFilterRequest extends BaseFilterRequest {
  name?: string;
  minRating?: number;
  maxRating?: number;
  hotelId?: string;
  userId?: string;
}

