import type { BaseEntity } from "./common";
import type { Promotion } from "./promotion";
import type { BookingRoom } from "./bookingRoom";
import type { Transaction } from "./transaction";
import type { BookingStatus } from "./enum";

export interface Booking extends BaseEntity {
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  totalAmount: number;
  status: BookingStatus;
  confirmationCode: string;
  promotionId?: string;
  promotion?: Promotion;
  guestCount: number;
  notes?: string;
  bookingRooms?: BookingRoom[];
  transaction?: Transaction;
}

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
