import type { PagedResponse } from "./common";
import type { Role } from "./role";
import type { BaseEntity } from "./common";
import type { LanguageCode, UserStatus } from "./enum";

export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId: number;
  role?: Role;
  status: UserStatus;
  lastLoginAt?: string;
  address?: string;
  profilePicture?: string;
  preferredLanguage?: LanguageCode;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleId: number;
  address?: string;
  preferredLanguage?: string;
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

export type GetAllUsersResponse = PagedResponse<User>;
