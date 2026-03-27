import { apiClient } from "../services/apiClient";
import { apiCall } from "../services/apiCall";
import type {
  ApiResponse,
  PagedResponse,
  BookingRequest,
  BookingResponse,
  BookingListResponse,
  BookingFilterRequest,
} from "../types";

export const bookingApi = {
  // CREATE BOOKING
  create: (data: BookingRequest) =>
    apiCall<ApiResponse<BookingResponse>>(
      apiClient.post("/bookings", data)
    ),

  // GET BY ID
  getById: (id: string) =>
    apiCall<ApiResponse<BookingResponse>>(
      apiClient.get(`/bookings/${id}`)
    ),

  // UPDATE
  update: (id: string, data: BookingRequest) =>
    apiCall<ApiResponse<BookingResponse>>(
      apiClient.put(`/bookings/${id}`, data)
    ),

  // CANCEL
  cancel: (id: string) =>
    apiCall<ApiResponse<void>>(
      apiClient.delete(`/bookings/${id}`)
    ),

  // GET ALL (pagination + filter)
  getAll: (params: BookingFilterRequest) =>
    apiCall<ApiResponse<PagedResponse<BookingListResponse>>>(
      apiClient.get("/bookings", { params })
    ),

  // CHECK-IN
  checkIn: (id: string) =>
    apiCall<ApiResponse<BookingResponse>>(
      apiClient.put(`/bookings/${id}/check-in`)
    ),

  // CHECK-OUT
  checkOut: (id: string) =>
    apiCall<ApiResponse<BookingResponse>>(
      apiClient.put(`/bookings/${id}/check-out`)
    ),
};