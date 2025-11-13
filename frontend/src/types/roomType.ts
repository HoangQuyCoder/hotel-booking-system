import type { Hotel } from "./hotel";
import type { BaseEntity } from "./common";

export interface RoomType extends BaseEntity {
  hotelId: string;
  hotel?: Hotel;
  name: string;
  capacity: number;
  sizeSqm: number;
  totalRooms: number;
  description?: string;
  isAvailable: boolean;
}
