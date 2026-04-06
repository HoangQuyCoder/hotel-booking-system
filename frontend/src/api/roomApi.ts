import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    RoomRequest,
    RoomResponse,
    RoomFilterRequest,
    PagedResponse
} from "../types";

export const roomApi = {
    // CREATE
    create: (data: RoomRequest) =>
        apiCall<ApiResponse<RoomResponse>>(
            apiClient.post("/rooms", data)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<RoomResponse>>(
            apiClient.get(`/rooms/${id}`)
        ),

    // UPDATE
    update: (id: string, data: RoomRequest) =>
        apiCall<ApiResponse<RoomResponse>>(
            apiClient.put(`/rooms/${id}`, data)
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/rooms/${id}`)
        ),

    // GET ALL
    getAll: (params: RoomFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<RoomResponse>>>(
            apiClient.get("/rooms", { params })
        ),
};