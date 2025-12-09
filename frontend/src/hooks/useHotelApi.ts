import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelApi } from "../api/hotelApi";
import type {
  HotelDetailResponse,
  HotelRequest,
  HotelUpdateRequest,
  HotelFilter,
} from "../types/hotel";
import { toast } from "react-toastify";
import type { PagedResponse } from "../types/common";

const KEY = {
  HOTELS: ["hotels"] as const,
  HOTEL: (id: string) => ["hotels", id] as const,
  CITIES: (q: string) => ["hotels", "cities", q] as const,
};

export const useHotelApi = () => {
  const qc = useQueryClient();

  // ========== GET ALL HOTELS =============
  const useAllHotels = (filter: HotelFilter = {}) =>
    useQuery({
      queryKey: [...KEY.HOTELS, filter],
      queryFn: () => hotelApi.getAllHotels(filter),
      select: (res) => res.data as PagedResponse<HotelDetailResponse>,
    });

  // ========= GET HOTEL DETAIL =============
  const useHotel = (id?: string) =>
    useQuery({
      queryKey: id ? KEY.HOTEL(id) : ["hotels", "hotel", "null"],
      queryFn: () => {
        if (!id) throw new Error("id required");
        return hotelApi.getHotel(id);
      },
      enabled: !!id,
      select: (res) => res.data as HotelDetailResponse,
    });

  // ========= CREATE HOTEL ============
  const createHotel = useMutation({
    mutationFn: (payload: HotelRequest) => hotelApi.createHotel(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Create hotel successfully");
      qc.invalidateQueries({ queryKey: KEY.HOTELS });
    },
    onError: () => toast.error("Create hotel failed"),
  });

  // ========== UPDATE HOTEL ===========
  const updateHotel = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: HotelUpdateRequest;
    }) => hotelApi.updateHotel(id, payload),
    onSuccess: (res) => {
      toast.success(res.message || "Update hotel successfully");
      qc.invalidateQueries({ queryKey: KEY.HOTELS });

      if (res.data?.id) {
        qc.invalidateQueries({ queryKey: KEY.HOTEL(res.data.id) });
      }
    },
    onError: () => toast.error("Update hotel failed"),
  });

  // ============= DELETE HOTEL ==============
  const deleteHotel = useMutation({
    mutationFn: (id: string) => hotelApi.deleteHotel(id),
    onSuccess: (res) => {
      toast.success(res.message || "Delete hotel successfully");
      qc.invalidateQueries({ queryKey: KEY.HOTELS });
    },
    onError: () => toast.error("Delete hotel failed"),
  });

  // ========= GET CITIES =========== 
  const useCities = (q: string) =>
    useQuery({
      queryKey: KEY.CITIES(q),
      queryFn: () => hotelApi.getCities(q),
      enabled: q.length > 0,
      select: (res) => res.data as string[],
    });

  return {
    // Queries
    useAllHotels,
    useHotel,
    useCities,

    // Mutations
    createHotel,
    updateHotel,
    deleteHotel,
  };
};
