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
export const FEATURED_KEY = ["hotels", "featured"];
export const TOP_RATED_KEY = ["hotels", "top-rated"];
export const NEWEST_KEY = ["hotels", "newest"];
export const DISCOVER_KEY = ["hotels", "discover"];
export const NEARBY_KEY = ["hotels", "nearby"];

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


  // Featured
  const useFeaturedHotels = () =>
    useQuery({
      queryKey: FEATURED_KEY,
      queryFn: () => hotelApi.getFeatured(),
      select: (res) => res.data,
    });

  // Top rated
  const useTopRatedHotels = () =>
    useQuery({
      queryKey: TOP_RATED_KEY,
      queryFn: () => hotelApi.getTopRated(),
      select: (res) => res.data,
    });

  // Newest
  const useNewestHotels = () =>
    useQuery({
      queryKey: NEWEST_KEY,
      queryFn: () => hotelApi.getNewest(),
      select: (res) => res.data,
    });

  // Discover
  const useDiscoverHotels = (city: string) =>
    useQuery({
      queryKey: [...DISCOVER_KEY, city],
      queryFn: () => hotelApi.getByCity(city),
      enabled: !!city,
      select: (res) => res.data,
    });

  // Nearby
  const useNearbyHotels = (lat?: number, lng?: number) =>
    useQuery({
      queryKey: [...NEARBY_KEY, lat, lng],
      queryFn: () => hotelApi.getNearby(lat!, lng!),
      enabled: !!lat && !!lng,
      select: (res) => res.data,
    });

  return {
    // existing
    useHotels,
    useHotelById,
    useCities,

    // new
    useFeaturedHotels,
    useTopRatedHotels,
    useNewestHotels,
    useDiscoverHotels,
    useNearbyHotels,

    // mutations
    createHotel,
    updateHotel,
    deleteHotel,
  };
};