import type { BaseEntity } from "./common";

export interface Review extends BaseEntity {
  name: string;
  rating: number;
  text: string;
}
