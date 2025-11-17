import api from "../services/apiClient";
import type { BookingRequest, BookingResponse } from "../types";

/**
 * Tạo đặt phòng mới (CLIENT)
 */
export const createBooking = async (data: BookingRequest) => {
  const response = await api.post<BookingResponse>("/bookings", data);
  return response.data;
};

/**
 * Lấy chi tiết đặt phòng (CLIENT/ADMIN/STAFF)
 */
export const getBookingById = async (id: string) => {
  const response = await api.get<BookingResponse>(`/bookings/${id}`);
  return response.data;
};

/**
 * Cập nhật đặt phòng (CLIENT nếu PENDING, ADMIN)
 */
export const updateBooking = async (
  id: string,
  data: Partial<BookingRequest>
) => {
  const response = await api.put<BookingResponse>(`/bookings/${id}`, data);
  return response.data;
};

/**
 * Hủy đặt phòng (CLIENT/ADMIN)
 */
export const cancelBooking = async (id: string) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.status === 204;
};

/**
 * Lấy danh sách đặt phòng (filter theo userId, hotelId)
 */
export const getBookings = async (params?: {
  userId?: string;
  hotelId?: string;
}) => {
  const response = await api.get<BookingResponse[]>("/bookings", { params });
  return response.data;
};

/**
 * Check-in đặt phòng (STAFF)
 */
export const checkInBooking = async (id: string) => {
  const response = await api.put<BookingResponse>(`/bookings/${id}/check-in`);
  return response.data;
};

/**
 * Check-out đặt phòng (STAFF)
 */
export const checkOutBooking = async (id: string) => {
  const response = await api.put<BookingResponse>(`/bookings/${id}/check-out`);
  return response.data;
};
