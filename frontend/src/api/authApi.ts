import apiClient from "../services/apiClient";
import type { ApiResponse } from "../types/api";
import type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "../types";
import { apiCall } from "../services/apiCall";

export const authApi = {
  login: (data: LoginRequest) =>
    apiCall<ApiResponse<UserResponse>>(
      apiClient.post("/auth/login", data)
    ),

  register: (data: RegisterRequest) =>
    apiCall<ApiResponse<UserResponse>>(
      apiClient.post("/auth/register", data)
    ),

  logout: () =>
    apiCall<ApiResponse<void>>(
      apiClient.post("/auth/logout")
    ),

  sendVerificationCode: (data: { email: string }) =>
    apiCall<ApiResponse<void>>(
      apiClient.post("/auth/send-code", data)
    ),

  verifyCode: (data: { email: string; code: string }) =>
    apiCall<ApiResponse<void>>(
      apiClient.post("/auth/verify-code", data)
    ),
};

