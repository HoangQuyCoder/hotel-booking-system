import type { BaseEntity } from "./common";
import type { RoomType } from "./roomType";

export interface RoomAmenity extends BaseEntity {
  roomTypeId: string;
  roomType?: RoomType;
  name: string;
  category: string;
}
