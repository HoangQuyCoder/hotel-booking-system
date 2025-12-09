import type { BaseEntity, BaseFilterRequest } from "./common";
import type { LanguageCode, RoleName, UserStatus } from "./enum";

export interface UserResponse extends BaseEntity {
  email: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  address: string | null;
  roleName: RoleName;
  status: UserStatus;
  profilePictureUrl: string | null;
  preferredLanguage: LanguageCode | null;
  lastLoginAt: string | null;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: string;
  roleName?: RoleName;
}

export interface UserFilterRequest extends BaseFilterRequest{
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  status?: UserStatus;
  keyword?: string;
}
