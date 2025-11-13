import type { BaseEntity } from "./common";
import type { RoleName } from "./enum";

export interface Role extends BaseEntity {
  roleName: RoleName;
  description?: string;
}
