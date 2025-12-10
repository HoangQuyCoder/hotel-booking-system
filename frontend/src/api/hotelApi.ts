import { apiCall } from "../services/apiCall";
import apiClient from "../services/apiClient";
import type { ApiResponse } from "../types/api";
import type { PagedResponse } from "../types/common";
import type {
  HotelDetailResponse,
  HotelRequest,
  HotelUpdateRequest,
  HotelFilter,
} from "../types/hotel";

const toQueryParams = (obj: HotelFilter) => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    // arrays or objects need special handling
    if (Array.isArray(v)) {
      v.forEach((val) => params.append(k, String(val)));
    } else {
      params.append(k, String(v));
    }
  });
  return params.toString();
};

export const hotelApi = {
  createHotel: (payload: HotelRequest) =>
    apiCall<ApiResponse<HotelDetailResponse>>(
      apiClient.post("/hotels", payload)
    ),

  getHotel: (id: string) =>
    apiCall<ApiResponse<HotelDetailResponse>>(
      apiClient.get(`/hotels/${id}`)
    ),

  updateHotel: (id: string, payload: HotelUpdateRequest) =>
    apiCall<ApiResponse<HotelDetailResponse>>(
      apiClient.put(`/hotels/${id}`, payload)
    ),

  deleteHotel: (id: string) =>
    apiCall<ApiResponse<void>>(
      apiClient.delete(`/hotels/${id}`)
    ),

  getAllHotels: (filter: HotelFilter = {}) => {
    const params = toQueryParams(filter);
    const url = params ? `/hotels?${params}` : "/hotels";

    return apiCall<ApiResponse<PagedResponse<HotelDetailResponse>>>(
      apiClient.get(url)
    );
  },

  getCities: (q: string) =>
    apiCall<ApiResponse<string[]>>(
      apiClient.get(`/hotels/cities?q=${encodeURIComponent(q)}`)
    ),
};
