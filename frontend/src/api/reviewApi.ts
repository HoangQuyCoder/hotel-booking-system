import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    ReviewRequest,
    ReviewResponse,
    ReviewFilterRequest,
    PagedResponse
} from "../types";

export const reviewApi = {
    // CREATE
    create: (data: ReviewRequest) =>
        apiCall<ApiResponse<ReviewResponse>>(
            apiClient.post("/reviews", data)
        ),

    // UPDATE
    update: (id: string, data: ReviewRequest) =>
        apiCall<ApiResponse<ReviewResponse>>(
            apiClient.put(`/reviews/${id}`, data)
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/reviews/${id}`)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<ReviewResponse>>(
            apiClient.get(`/reviews/${id}`)
        ),

    // GET ALL
    getAll: (params: ReviewFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<ReviewResponse>>>(
            apiClient.get("/reviews", { params })
        ),

    // GET BY HOTEL
    getByHotel: (hotelId: string, page = 0, size = 10) =>
        apiCall<ApiResponse<PagedResponse<ReviewResponse>>>(
            apiClient.get(`/reviews/hotel/${hotelId}`, {
                params: { page, size },
            })
        ),
};