import type { BaseEntity } from "./common";

export interface BookingRoom extends BaseEntity {
  bookingId: string;
  quantity: number;
  pricePerNight: number;
  specificRoomIds: string[]; // the list of UUIDs
}
