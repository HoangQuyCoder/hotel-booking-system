import type { BaseEntity } from "./common";
import type { RoomTypeListResponse } from "./roomType";

export interface BookingRoomResponse extends BaseEntity {
  roomType: RoomTypeListResponse;
  quantity: number;
  pricePerNight: number;
  bookingRoomDetails: BookingRoomDetailResponse[];
}

export interface BookingRoomRequest {
  roomTypeId: string;
  quantity: number;
}

export interface BookingRoomDetailResponse extends BaseEntity {
  roomId: string;
  bookingRoomId: string;
}
