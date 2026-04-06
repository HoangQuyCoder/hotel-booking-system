import type { BaseEntity, BaseFilterRequest } from "./common";
import type { BookingRoomRequest, BookingRoomResponse } from "./bookingRoom";
import type { BookingStatus } from "./enum";
import type { PromotionResponse } from "./promotion";
import type { HotelListResponse } from "./hotel";
import type { UserListResponse } from "./user";

export interface BookingResponse extends BaseEntity {
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  confirmationCode: string;
  guestCount: number;
  notes: string;
  hotel: HotelListResponse;
  user: UserListResponse;
  promotion: PromotionResponse;
  bookingRooms: BookingRoomResponse[];
}

export interface BookingListResponse extends BaseEntity {
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: BookingStatus;
  confirmationCode: string;
  guestCount: number;
  hotelName: string;
  notes: string;
}

export interface BookingRequest {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  bookingRooms: BookingRoomRequest[];
  notes?: string;
  promoCode?: string;
}

export interface BookingFilterRequest extends BaseFilterRequest {
  userId?: string;
  hotelId?: string;
  promotionId?: string;
  status?: BookingStatus;
  checkInFrom?: string;
  checkInTo?: string;
  checkOutFrom?: string;
  checkOutTo?: string;
  minTotalAmount?: number;
  maxTotalAmount?: number;
}
