import type { BaseEntity } from "./common";

export interface ReviewResponse extends BaseEntity {
  name: string;
  rating: number;
  text: string;
}
