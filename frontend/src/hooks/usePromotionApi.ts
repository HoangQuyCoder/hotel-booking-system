import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { promotionApi } from "../api/promotionApi";
import type {
    PromotionRequest,
    PromotionFilterRequest,
} from "../types";

const PROMOTIONS_KEY = ["promotions"];
const PROMOTION_KEY = ["promotion"];

export const usePromotionApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const usePromotions = (params: PromotionFilterRequest) =>
        useQuery({
            queryKey: [...PROMOTIONS_KEY, params],
            queryFn: () => promotionApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const usePromotionById = (id: string) =>
        useQuery({
            queryKey: [...PROMOTION_KEY, id],
            queryFn: () => promotionApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createPromotion = useMutation({
        mutationFn: promotionApi.create,

        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEY });
        },
    });

    // ================= UPDATE =================
    const updatePromotion = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: PromotionRequest;
        }) => promotionApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...PROMOTION_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEY });
        },
    });

    // ================= DELETE =================
    const deletePromotion = useMutation({
        mutationFn: (id: string) => promotionApi.delete(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.removeQueries({ queryKey: [...PROMOTION_KEY, id] });
            queryClient.invalidateQueries({ queryKey: PROMOTIONS_KEY });
        },
    });

    return {
        usePromotions,
        usePromotionById,
        createPromotion,
        updatePromotion,
        deletePromotion,
    };
};