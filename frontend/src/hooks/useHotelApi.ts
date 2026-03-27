import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { hotelApi } from "../api/hotelApi";
import type {
  HotelUpdateRequest,
  HotelFilterRequest,
} from "../types";

const HOTELS_KEY = ["hotels"];
const HOTEL_KEY = ["hotel"];
const CITIES_KEY = ["cities"];

export const useHotelApi = () => {
  const queryClient = useQueryClient();

  // ================= GET ALL =================
  const useHotels = (params: HotelFilterRequest) =>
    useQuery({
      queryKey: [...HOTELS_KEY, params],
      queryFn: () => hotelApi.getAll(params),
      select: (res) => res.data,
    });

  // ================= GET BY ID =================
  const useHotelById = (id: string) =>
    useQuery({
      queryKey: [...HOTEL_KEY, id],
      queryFn: () => hotelApi.getById(id),
      enabled: !!id,
      select: (res) => res.data,
    });

  // ================= SEARCH CITIES =================
  const useCities = (q: string) =>
    useQuery({
      queryKey: [...CITIES_KEY, q],
      queryFn: () => hotelApi.getCities(q),
      enabled: !!q,
      select: (res) => res.data,
    });

  // ================= CREATE =================
  const createHotel = useMutation({
    mutationFn: hotelApi.create,

    onSuccess: (res) => {
      toast.success(res.message);

      // refetch list
      queryClient.invalidateQueries({ queryKey: HOTELS_KEY });
    },
  });

  // ================= UPDATE =================
  const updateHotel = useMutation({
    mutationFn: ({ id, data }: { id: string; data: HotelUpdateRequest }) => hotelApi.update(id, data),

    onSuccess: (res, variables) => {
      toast.success(res.message);

      // update cache detail
      queryClient.setQueryData(
        [...HOTEL_KEY, variables.id],
        res.data
      );

      // refetch list
      queryClient.invalidateQueries({ queryKey: HOTELS_KEY });
    },
  });

  // ================= DELETE =================
  const deleteHotel = useMutation({
    mutationFn: (id: string) => hotelApi.delete(id),

    onSuccess: (res, id) => {
      toast.success(res.message);

      // remove cache
      queryClient.removeQueries({ queryKey: [...HOTEL_KEY, id] });

      // refetch list
      queryClient.invalidateQueries({ queryKey: HOTELS_KEY });
    },
  });

  return {
    useHotels,
    useHotelById,
    useCities,
    createHotel,
    updateHotel,
    deleteHotel,
  };
};