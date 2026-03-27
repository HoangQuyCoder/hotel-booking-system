import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { dailyOverrideApi } from "../api/dailyOverrideApi";
import type {
    DailyOverrideRequest,
    DailyOverrideFilterRequest,
} from "../types";

const DAILY_OVERRIDES_KEY = ["dailyOverrides"];
const DAILY_OVERRIDE_KEY = ["dailyOverride"];

export const useDailyOverrideApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useDailyOverrides = (params: DailyOverrideFilterRequest) =>
        useQuery({
            queryKey: [...DAILY_OVERRIDES_KEY, params],
            queryFn: () => dailyOverrideApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useDailyOverrideById = (id: string) =>
        useQuery({
            queryKey: [...DAILY_OVERRIDE_KEY, id],
            queryFn: () => dailyOverrideApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createDailyOverride = useMutation({
        mutationFn: dailyOverrideApi.create,

        onSuccess: (res) => {
            toast.success(res.message);

            // 🔥 refetch list
            queryClient.invalidateQueries({ queryKey: DAILY_OVERRIDES_KEY });
        },
    });

    // ================= UPDATE =================
    const updateDailyOverride = useMutation({
        mutationFn: ({ id, data }: { id: string; data: DailyOverrideRequest }) => dailyOverrideApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            // 🔥 update cache detail
            queryClient.setQueryData(
                [...DAILY_OVERRIDE_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: DAILY_OVERRIDES_KEY });
        },
    });

    // ================= DELETE =================
    const deleteDailyOverride = useMutation({
        mutationFn: (id: string) => dailyOverrideApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            // 🔥 remove cache
            queryClient.removeQueries({ queryKey: [...DAILY_OVERRIDE_KEY, id] });

            queryClient.invalidateQueries({ queryKey: DAILY_OVERRIDES_KEY });
        },
    });

    return {
        useDailyOverrides,
        useDailyOverrideById,
        createDailyOverride,
        updateDailyOverride,
        deleteDailyOverride,
    };
};