import apiClient from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
  UserFilterRequest,
  UserResponse,
  UserUpdateRequest,
} from "../types";
import type { ApiResponse } from "../types/api";
import type { PagedResponse } from "../types/common";

export const userApi = {
  getCurrentUser: () =>
    apiCall<ApiResponse<UserResponse>>(
      apiClient.get("/users/me", { silent: true })
    ),

  getUserById: (id: string) =>
    apiCall<ApiResponse<UserResponse>>(apiClient.get(`/users/${id}`)),

  getAllUsers: (params: UserFilterRequest) =>
    apiCall<ApiResponse<PagedResponse<UserResponse>>>(
      apiClient.get("/users", { params })
    ),

  updateUser: (id: string, body: UserUpdateRequest) =>
    apiCall<ApiResponse<UserResponse>>(apiClient.put(`/users/${id}`, body)),

  deleteUser: (id: string) =>
    apiCall<ApiResponse<void>>(apiClient.delete(`/users/${id}`)),
};
