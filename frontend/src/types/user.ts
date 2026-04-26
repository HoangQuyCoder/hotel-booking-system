import type { BaseEntity, BaseFilterRequest } from "./common";
import type { LanguageCode, RoleName, UserStatus } from "./enum";

export interface UserResponse extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  roleName: RoleName;
  status: UserStatus;
  profilePictureUrl: string;
  preferredLanguage: LanguageCode;
  lastLoginAt: string;
  failedLoginAttempts: number;
  lockedUntil: string;
  accessToken?: string;
}


export interface UserListResponse extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: string;
  roleName?: RoleName;
}

export interface UserFilterRequest extends BaseFilterRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  status?: UserStatus;
  keyword?: string;
}

export interface ManagerResponse {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}