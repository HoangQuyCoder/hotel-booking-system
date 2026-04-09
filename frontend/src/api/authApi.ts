import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
} from "../types";

export const authApi = {
  login: (data: LoginRequest) =>
    apiCall<ApiResponse<UserResponse>>(apiClient.post("/auth/login", data)),

  register: (data: RegisterRequest) =>
    apiCall<ApiResponse<UserResponse>>(apiClient.post("/auth/register", data)),

  logout: () => apiCall<ApiResponse<void>>(apiClient.post("/auth/logout")),

  sendVerificationCode: (data: { email: string }) =>
    apiCall<ApiResponse<void>>(apiClient.post("/auth/send-code", data)),

  verifyCode: (data: { email: string; code: string }) =>
    apiCall<ApiResponse<void>>(apiClient.post("/auth/verify-code", data)),

  forgotPassword: (data: { email: string }) =>
    apiCall<ApiResponse<any>>(apiClient.post("/auth/forgot-password", data)),

  resetPassword: (data: ResetPasswordRequest) =>
    apiCall<ApiResponse<any>>(apiClient.post("/auth/reset-password", data)),

  validateResetToken: (data: { token: string }) =>
    apiCall<ApiResponse<any>>(
      apiClient.get("/auth/validate-reset-token", { params: data }),
    ),
};
