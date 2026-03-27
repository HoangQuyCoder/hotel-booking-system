import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type { ApiResponse } from "../types";
import type {
    BaseRateRequest,
    BaseRateResponse,
    BaseRateFilterRequest,
    PagedResponse
} from "../types";

export const baseRateApi = {
    // CREATE
    create: (data: BaseRateRequest) =>
        apiCall<ApiResponse<BaseRateResponse>>(
            apiClient.post("/base-rates", data)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<BaseRateResponse>>(
            apiClient.get(`/base-rates/${id}`)
        ),

    // UPDATE
    update: (id: string, data: BaseRateRequest) =>
        apiCall<ApiResponse<BaseRateResponse>>(
            apiClient.put(`/base-rates/${id}`, data)
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/base-rates/${id}`)
        ),

    // GET ALL (pagination + filter)
    getAll: (params: BaseRateFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<BaseRateResponse>>>(
            apiClient.get("/base-rates", { params })
        ),
};