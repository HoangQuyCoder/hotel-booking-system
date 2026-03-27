import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { roomTypeApi } from "../api/roomTypeApi";
import type {
    RoomTypeUpdateRequest,
    RoomTypeFilterRequest,
} from "../types";

const ROOM_TYPES_KEY = ["roomTypes"];
const ROOM_TYPE_KEY = ["roomType"];

export const useRoomTypeApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useRoomTypes = (params: RoomTypeFilterRequest) =>
        useQuery({
            queryKey: [...ROOM_TYPES_KEY, params],
            queryFn: () => roomTypeApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useRoomTypeById = (id: string) =>
        useQuery({
            queryKey: [...ROOM_TYPE_KEY, id],
            queryFn: () => roomTypeApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createRoomType = useMutation({
        mutationFn: roomTypeApi.create,

        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ROOM_TYPES_KEY });
        },
    });

    // ================= UPDATE =================
    const updateRoomType = useMutation({
        mutationFn: ({ id, data }: { id: string; data: RoomTypeUpdateRequest }) => roomTypeApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...ROOM_TYPE_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: ROOM_TYPES_KEY });
        },
    });

    // ================= UPDATE AVAILABILITY =================
    const updateAvailability = useMutation({
        mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
            roomTypeApi.updateAvailability(id, isAvailable),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...ROOM_TYPE_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: ROOM_TYPES_KEY });
        },
    });

    // ================= DELETE =================
    const deleteRoomType = useMutation({
        mutationFn: (id: string) => roomTypeApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.removeQueries({ queryKey: [...ROOM_TYPE_KEY, id] });
            queryClient.invalidateQueries({ queryKey: ROOM_TYPES_KEY });
        },
    });

    return {
        useRoomTypes,
        useRoomTypeById,
        createRoomType,
        updateRoomType,
        updateAvailability,
        deleteRoomType,
    };
};