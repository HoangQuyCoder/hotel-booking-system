import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
  ApiResponse,
  PagedResponse,
  HotelDetailResponse,
  HotelListResponse,
  HotelRequest,
  HotelUpdateRequest,
  HotelFilterRequest,
} from "../types";

export const hotelApi = {
  // CREATE
  create: (data: HotelRequest) =>
    apiCall<ApiResponse<HotelDetailResponse>>(
      apiClient.post("/hotels", data)
    ),

  // GET BY ID
  getById: (id: string) =>
    apiCall<ApiResponse<HotelDetailResponse>>(
      apiClient.get(`/hotels/${id}`)
    ),

  // UPDATE
  update: (id: string, data: HotelUpdateRequest) =>
    apiCall<ApiResponse<HotelDetailResponse>>(
      apiClient.put(`/hotels/${id}`, data)
    ),

  // DELETE
  delete: (id: string) =>
    apiCall<ApiResponse<void>>(
      apiClient.delete(`/hotels/${id}`)
    ),

  // GET ALL (pagination + filter)
  getAll: (params: HotelFilterRequest) =>
    apiCall<ApiResponse<PagedResponse<HotelListResponse>>>(
      apiClient.get("/hotels", { params })
    ),

  // SEARCH CITIES
  getCities: (q: string) =>
    apiCall<ApiResponse<string[]>>(
      apiClient.get("/hotels/cities", {
        params: { q },
      })
    ),

  // ================= FEATURED =================
  getFeatured: () =>
    apiCall<ApiResponse<HotelListResponse[]>>(
      apiClient.get("/hotels/featured")
    ),

  // ================= TOP RATED =================
  getTopRated: () =>
    apiCall<ApiResponse<HotelListResponse[]>>(
      apiClient.get("/hotels/top-rated")
    ),

  // ================= NEWEST =================
  getNewest: () =>
    apiCall<ApiResponse<HotelListResponse[]>>(
      apiClient.get("/hotels/newest")
    ),

  // ================= DISCOVER =================
  getByCity: (city: string) =>
    apiCall<ApiResponse<HotelListResponse[]>>(
      apiClient.get("/hotels/discover", {
        params: { city },
      })
    ),

  // ================= NEARBY =================
  getNearby: (lat: number, lng: number) =>
    apiCall<ApiResponse<HotelListResponse[]>>(
      apiClient.get("/hotels/nearby", {
        params: { lat, lng },
      })
    ),
};