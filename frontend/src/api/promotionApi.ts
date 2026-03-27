import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    PromotionRequest,
    PromotionResponse,
    PromotionFilterRequest,
    PagedResponse
} from "../types";

export const promotionApi = {
    // CREATE
    create: (data: PromotionRequest) =>
        apiCall<ApiResponse<PromotionResponse>>(
            apiClient.post("/promotions", data)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<PromotionResponse>>(
            apiClient.get(`/promotions/${id}`)
        ),

    // UPDATE
    update: (id: string, data: PromotionRequest) =>
        apiCall<ApiResponse<PromotionResponse>>(
            apiClient.put(`/promotions/${id}`, data)
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/promotions/${id}`)
        ),

    // GET ALL
    getAll: (params: PromotionFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<PromotionResponse>>>(
            apiClient.get("/promotions", { params })
        ),
};