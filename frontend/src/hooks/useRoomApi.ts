import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { roomApi } from "../api/roomApi";
import type {
    RoomRequest,
    RoomFilterRequest,
} from "../types";

const ROOMS_KEY = ["rooms"];
const ROOM_KEY = ["room"];

export const useRoomApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useRooms = (params: RoomFilterRequest) =>
        useQuery({
            queryKey: [...ROOMS_KEY, params],
            queryFn: () => roomApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useRoomById = (id: string) =>
        useQuery({
            queryKey: [...ROOM_KEY, id],
            queryFn: () => roomApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createRoom = useMutation({
        mutationFn: roomApi.create,

        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ROOMS_KEY });
        },
    });

    // ================= UPDATE =================
    const updateRoom = useMutation({
        mutationFn: ({ id, data }: { id: string; data: RoomRequest }) => roomApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...ROOM_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: ROOMS_KEY });
        },
    });

    // ================= DELETE =================
    const deleteRoom = useMutation({
        mutationFn: (id: string) => roomApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.removeQueries({ queryKey: [...ROOM_KEY, id] });
            queryClient.invalidateQueries({ queryKey: ROOMS_KEY });
        },
    });

    return {
        useRooms,
        useRoomById,
        createRoom,
        updateRoom,
        deleteRoom,
    };
};