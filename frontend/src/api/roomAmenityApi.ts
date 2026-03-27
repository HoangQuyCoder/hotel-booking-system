import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
  ApiResponse,
  RoomAmenityRequest,
  RoomAmenityResponse,
  RoomAmenityFilterRequest,
  PagedResponse
} from "../types";

export const roomAmenityApi = {
  // CREATE
  create: (data: RoomAmenityRequest) =>
    apiCall<ApiResponse<RoomAmenityResponse>>(
      apiClient.post("/room-amenities", data)
    ),

  // GET BY ID
  getById: (id: string) =>
    apiCall<ApiResponse<RoomAmenityResponse>>(
      apiClient.get(`/room-amenities/${id}`)
    ),

  // UPDATE
  update: (id: string, data: RoomAmenityRequest) =>
    apiCall<ApiResponse<RoomAmenityResponse>>(
      apiClient.put(`/room-amenities/${id}`, data)
    ),

  // DELETE
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(
      apiClient.delete(`/room-amenities/${id}`)
    ),

  // GET ALL
  getAll: (params: RoomAmenityFilterRequest) =>
    apiCall<ApiResponse<PagedResponse<RoomAmenityResponse>>>(
      apiClient.get("/room-amenities", { params })
    ),
};