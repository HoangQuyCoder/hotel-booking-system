import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type { ApiResponse, RoleRequest, RoleResponse } from "../types";

export const roleApi = {
  // CREATE ROLE
  create: (data: RoleRequest) =>
    apiCall<ApiResponse<RoleResponse>>(
      apiClient.post("/roles", data)
    ),

  // GET BY ID
  getById: (id: number) =>
    apiCall<ApiResponse<RoleResponse>>(
      apiClient.get(`/roles/${id}`)
    ),

  // UPDATE
  update: (id: number, data: RoleRequest) =>
    apiCall<ApiResponse<RoleResponse>>(
      apiClient.put(`/roles/${id}`, data)
    ),

  // DELETE
  delete: (id: number) =>
    apiCall<ApiResponse<void>>(
      apiClient.delete(`/roles/${id}`)
    ),

  // GET ALL
  getAll: () =>
    apiCall<ApiResponse<RoleResponse[]>>(
      apiClient.get("/roles")
    ),
};