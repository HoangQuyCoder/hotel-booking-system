import type { RoomType } from "./roomType";
import type { BaseEntity } from "./common";

export interface DailyOverride extends BaseEntity {
  roomTypeId: string;
  roomType?: RoomType;
  date: string;
  priceAdjustment?: number;
  availableRooms?: number;
  reason?: string;
}
