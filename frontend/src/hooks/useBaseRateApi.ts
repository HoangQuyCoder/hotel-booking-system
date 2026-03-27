import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { baseRateApi } from "../api/baseRateApi";
import type {
    BaseRateRequest,
    BaseRateFilterRequest,
} from "../types";

const BASE_RATES_KEY = ["baseRates"];
const BASE_RATE_KEY = ["baseRate"];


export const useBaseRateApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useBaseRates = (params: BaseRateFilterRequest) =>
        useQuery({
            queryKey: [...BASE_RATES_KEY, params],
            queryFn: () => baseRateApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useBaseRateById = (id: string) =>
        useQuery({
            queryKey: [...BASE_RATE_KEY, id],
            queryFn: () => baseRateApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createBaseRate = useMutation({
        mutationFn: baseRateApi.create,

        onSuccess: (res) => {
            toast.success(res.message);

            // 🔥 refetch list
            queryClient.invalidateQueries({ queryKey: BASE_RATES_KEY });
        },
    });

    // ================= UPDATE =================
    const updateBaseRate = useMutation({
        mutationFn: ({ id, data }: { id: string; data: BaseRateRequest }) => baseRateApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            // 🔥 update cache detail
            queryClient.setQueryData(
                [...BASE_RATE_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: BASE_RATES_KEY });
        },
    });

    // ================= DELETE =================
    const deleteBaseRate = useMutation({
        mutationFn: (id: string) => baseRateApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            // 🔥 remove cache
            queryClient.removeQueries({ queryKey: [...BASE_RATE_KEY, id] });

            queryClient.invalidateQueries({ queryKey: BASE_RATES_KEY });
        },
    });

    return {
        useBaseRates,
        useBaseRateById,
        createBaseRate,
        updateBaseRate,
        deleteBaseRate,
    };
};