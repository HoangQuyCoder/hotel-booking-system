import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type { ApiResponse } from "../types";
import type {
  UserResponse,
  UserUpdateRequest,
  UserFilterRequest,
  PagedResponse
} from "../types";

export const userApi = {
  // GET /users/me
  getMe: () =>
    apiCall<ApiResponse<UserResponse>>(
      apiClient.get("/users/me")
    ),

  // GET /users/{id}
  getById: (id: string) =>
    apiCall<ApiResponse<UserResponse>>(
      apiClient.get(`/users/${id}`)
    ),

  // GET /users (filter + pagination)
  getAll: (params: UserFilterRequest) =>
    apiCall<ApiResponse<PagedResponse<UserResponse>>>(
      apiClient.get("/users", { params })
    ),

  // PUT /users/{id}
  update: (id: string, data: UserUpdateRequest) =>
    apiCall<ApiResponse<UserResponse>>(
      apiClient.put(`/users/${id}`, data)
    ),

  // DELETE /users/{id}
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(
      apiClient.delete(`/users/${id}`)
    ),
};