import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { roomAmenityApi } from "../api/roomAmenityApi";
import type {
    RoomAmenityRequest,
    RoomAmenityFilterRequest,
} from "../types";

const ROOM_AMENITIES_KEY = ["roomAmenities"];
const ROOM_AMENITY_KEY = ["roomAmenity"];

export const useRoomAmenityApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useRoomAmenities = (params: RoomAmenityFilterRequest) =>
        useQuery({
            queryKey: [...ROOM_AMENITIES_KEY, params],
            queryFn: () => roomAmenityApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useRoomAmenityById = (id: string) =>
        useQuery({
            queryKey: [...ROOM_AMENITY_KEY, id],
            queryFn: () => roomAmenityApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createRoomAmenity = useMutation({
        mutationFn: roomAmenityApi.create,

        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ROOM_AMENITIES_KEY });
        },
    });

    // ================= UPDATE =================
    const updateRoomAmenity = useMutation({
        mutationFn: ({ id, data }: { id: string; data: RoomAmenityRequest }) => roomAmenityApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...ROOM_AMENITY_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: ROOM_AMENITIES_KEY });
        },
    });

    // ================= DELETE =================
    const deleteRoomAmenity = useMutation({
        mutationFn: (id: string) => roomAmenityApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.removeQueries({ queryKey: [...ROOM_AMENITY_KEY, id] });
            queryClient.invalidateQueries({ queryKey: ROOM_AMENITIES_KEY });
        },
    });

    return {
        useRoomAmenities,
        useRoomAmenityById,
        createRoomAmenity,
        updateRoomAmenity,
        deleteRoomAmenity,
    };
};