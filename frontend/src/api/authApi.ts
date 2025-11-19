import api from "../services/apiClient";
import type { ApiResponse } from "../types/api";
import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<UserResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<UserResponse>>("/auth/register", data),

  logout: () =>
    api.post<ApiResponse<void>>("/auth/logout"),

  sendVerificationCode: (data: { email: string }) =>
    api.post<ApiResponse<void>>("/auth/send-code", data),

  verifyCode: (data: { email: string; code: string }) =>
    api.post<ApiResponse<void>>("/auth/verify-code", data),
};
