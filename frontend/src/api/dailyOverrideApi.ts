import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    DailyOverrideRequest,
    DailyOverrideResponse,
    DailyOverrideFilterRequest,
    PagedResponse
} from "../types";

export const dailyOverrideApi = {
    // CREATE
    create: (data: DailyOverrideRequest) =>
        apiCall<ApiResponse<DailyOverrideResponse>>(
            apiClient.post("/daily-overrides", data)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<DailyOverrideResponse>>(
            apiClient.get(`/daily-overrides/${id}`)
        ),

    // UPDATE
    update: (id: string, data: DailyOverrideRequest) =>
        apiCall<ApiResponse<DailyOverrideResponse>>(
            apiClient.put(`/daily-overrides/${id}`, data)
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/daily-overrides/${id}`)
        ),

    // GET ALL (pagination + filter)
    getAll: (params: DailyOverrideFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<DailyOverrideResponse>>>(
            apiClient.get("/daily-overrides", { params })
        ),
};