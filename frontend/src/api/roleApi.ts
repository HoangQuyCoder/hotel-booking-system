import apiClient from "../services/apiClient";
import type { RoleRequest, RoleResponse } from "../types/role";
import { apiCall } from "../services/apiCall";
import type { ApiResponse } from "../types";

const BASE_URL = "roles";

export const roleApi = {
  createRole: (payload: RoleRequest) =>
    apiCall<ApiResponse<RoleResponse>>(apiClient.post(BASE_URL, payload)),

  getRole: (id: string) =>
    apiCall<ApiResponse<RoleResponse>>(apiClient.get(`${BASE_URL}/${id}`)),

  updateRole: (id: number, payload: RoleRequest) =>
    apiCall<ApiResponse<RoleResponse>>(
      apiClient.put(`${BASE_URL}/${id}`, payload)
    ),

  deleteRole: (id: number) =>
    apiCall<ApiResponse<void>>(apiClient.delete(`${BASE_URL}/${id}`)),

  getAllRoles: () =>
    apiCall<ApiResponse<RoleResponse[]>>(apiClient.get(BASE_URL)),
};
