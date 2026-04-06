import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
    ApiResponse,
    RoomTypeRequest,
    RoomTypeResponse,
    RoomTypeUpdateRequest,
    RoomTypeListResponse,
    RoomTypeFilterRequest,
    PagedResponse
} from "../types";

export const roomTypeApi = {
    // CREATE
    create: (data: RoomTypeRequest) =>
        apiCall<ApiResponse<RoomTypeResponse>>(
            apiClient.post("/room-types", data)
        ),

    // GET BY ID
    getById: (id: string) =>
        apiCall<ApiResponse<RoomTypeResponse>>(
            apiClient.get(`/room-types/${id}`)
        ),

    // UPDATE
    update: (id: string, data: RoomTypeUpdateRequest) =>
        apiCall<ApiResponse<RoomTypeResponse>>(
            apiClient.put(`/room-types/${id}`, data)
        ),

    // UPDATE AVAILABILITY (PATCH)
    updateAvailability: (id: string, isAvailable: boolean) =>
        apiCall<ApiResponse<RoomTypeResponse>>(
            apiClient.patch(`/room-types/${id}/availability`, null, {
                params: { isAvailable },
            })
        ),

    // DELETE
    delete: (id: string) =>
        apiCall<ApiResponse<void>>(
            apiClient.delete(`/room-types/${id}`)
        ),

    // GET ALL
    getAll: (params: RoomTypeFilterRequest) =>
        apiCall<ApiResponse<PagedResponse<RoomTypeListResponse>>>(
            apiClient.get("/room-types", { params })
        ),
};