import type { RoomTypeResponse } from "./roomType";
import type { BaseEntity } from "./common";
import type { RoomStatus } from "./enum";

export interface Room extends BaseEntity {
  roomTypeId: string;
  roomType?: RoomTypeResponse;
  roomNumber: string;
  status: RoomStatus;
  desc: string;
}
