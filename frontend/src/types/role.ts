import type { BaseEntity } from "./common";
import type { RoleName } from "./enum";

export interface RoleResponse extends BaseEntity {
  roleName: RoleName;
  description?: string;
}

export interface RoleRequest {
  roleName: RoleName;
  description?: string;
}
