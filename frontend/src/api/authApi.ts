import api from "../services/apiClient";
import type { ApiResponse } from "../types/api";
import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../types";

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<UserResponse>>("/auth/login", data).then(r => r.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<UserResponse>>("/auth/register", data).then(r => r.data),

  logout: () =>
    api.post<ApiResponse<void>>("/auth/logout").then(r => r.data),

  sendVerificationCode: (data: { email: string }) =>
    api.post<ApiResponse<void>>("/auth/send-code", data).then(r => r.data),

  verifyCode: (data: { email: string; code: string }) =>
    api.post<ApiResponse<void>>("/auth/verify-code", data).then(r => r.data),
};

