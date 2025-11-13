import type { RoomType } from "./roomType";
import type { BaseEntity } from "./common";

export interface BaseRate extends BaseEntity {
  roomTypeId: string;
  roomType?: RoomType;
  basePrice: number;
  startDate: string;
  endDate: string;
}
