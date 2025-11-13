import type { RoomType } from "./roomType";
import type { BaseEntity } from "./common";
import type { RoomStatus } from "./enum";

export interface Room extends BaseEntity {
  roomTypeId: string;
  roomType?: RoomType;
  roomNumber: string;
  status: RoomStatus;
}
