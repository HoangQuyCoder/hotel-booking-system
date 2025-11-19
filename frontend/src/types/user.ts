import type { PagedResponse } from "./common";
import type { BaseEntity } from "./common";
import type { LanguageCode, RoleName, UserStatus } from "./enum";

export interface UserResponse extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  roleName: RoleName;
  status: UserStatus;
  profilePictureUrl: string | null;
  preferredLanguage: LanguageCode | null;
  lastLoginAt: string | null;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  roleId?: number;
  preferredLanguage?: string;
  isActive?: boolean;
  status?: UserStatus;
}

export type GetAllUsersResponse = PagedResponse<UserResponse>;
