import type { RoleName } from "./enum";
import type { UserResponse } from "./user";

export interface AuthContextType {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address?: string;
  preferredLanguage?: string;
  roleName?: RoleName;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
