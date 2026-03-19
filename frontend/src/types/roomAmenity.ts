import type { BaseEntity } from "./common";
import type { RoomTypeResponse } from "./roomType";

export interface RoomAmenity extends BaseEntity {
  roomTypeId: string;
  roomType?: RoomTypeResponse;
  name: string;
  category: string;
  icon?: string;
}
