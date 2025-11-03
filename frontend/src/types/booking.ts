import { type Hotel } from "./hotel";
import { type User } from "./user";

export interface BookingRoomResponse {
  id: string;
  roomId: string;
  roomNumber: string;
  pricePerNight: number;
  nights: number;
  subtotal: number;
}

export interface Booking {
  id: string;
  user: User;
  hotel: Hotel;
  checkInDate: string; // ISO date
  checkOutDate: string; // ISO date
  totalAmount: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "REFUNDED";

export interface BookingRequest {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingResponse {
  id: string;
  message: string;
  booking: Booking;
}
