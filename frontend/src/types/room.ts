import type { BaseEntity, BaseFilterRequest } from "./common";
import type { RoomStatus } from "./enum";

export interface RoomResponse extends BaseEntity {
  roomNumber: string;
  status: RoomStatus;
}

export interface RoomRequest {
  roomTypeId: string;
  roomNumber: string;
  status: RoomStatus;
}

export interface RoomFilterRequest extends BaseFilterRequest {
  roomTypeId?: string;
  roomNumber?: string;
  status?: RoomStatus;
}
