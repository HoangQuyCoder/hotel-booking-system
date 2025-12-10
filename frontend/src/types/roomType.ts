import type { BaseRate } from "./baseRate";
import type { BaseEntity } from "./common";
import type { RoomAmenity } from "./roomAmenity";
import type { Room } from "./room";
import type { DailyOverride } from "./dailyOverride";

export interface RoomTypeResponse extends BaseEntity {
  name: string;
  capacity: number;
  sizeSqm: number;
  totalRooms: number;
  description?: string;
  isAvailable: boolean;
  rooms: Room[];
  amenities: RoomAmenity[];
  baseRates: BaseRate[];
  dailyOverrides: DailyOverride[];
}
