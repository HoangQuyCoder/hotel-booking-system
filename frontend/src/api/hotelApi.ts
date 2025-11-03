// src/api/hotelApi.ts
import api from "../services/apiClient";
import type { Hotel, HotelResponse, SearchFilters } from "../types";

// === Tìm kiếm khách sạn (có phân trang) ===
export const searchHotels = (
  filters: SearchFilters = {},
  page: number = 0,
  size: number = 9
): Promise<{ data: HotelResponse }> => {
  const params = new URLSearchParams();

  if (filters.city) params.append("city", filters.city.trim());
  if (filters.minRating !== undefined)
    params.append("minRating", String(filters.minRating));
  if (filters.isActive !== undefined)
    params.append("isActive", String(filters.isActive));

  params.append("page", String(page));
  params.append("size", String(size));

  return api.get<HotelResponse>("/hotels", { params });
};

// === Lấy chi tiết 1 hotel ===
export const getHotelById = (id: string): Promise<{ data: Hotel }> => {
  return api.get<Hotel>(`/hotels/${id}`);
};

// === Tạo hotel mới (ADMIN) ===
export const createHotel = (
  data: Omit<Hotel, "id" | "createdAt" | "updatedAt" | "isActive">
): Promise<{ data: Hotel }> => {
  return api.post<Hotel>("/hotels", data);
};

// === Cập nhật hotel (ADMIN) ===
export const updateHotel = (
  id: string,
  data: Partial<Hotel>
): Promise<{ data: Hotel }> => {
  return api.put<Hotel>(`/hotels/${id}`, data);
};

// === Xóa mềm hotel (ADMIN) ===
export const deleteHotel = (id: string): Promise<void> => {
  return api.delete(`/hotels/${id}`);
};

// === Tìm gợi ý thành phố (dùng cho autocomplete) ===
export const getCitySuggestions = async (query: string): Promise<string[]> => {
  const res = await api.get<string[]>("/hotels/cities", {
    params: { q: query },
  });
  return res.data;
};
