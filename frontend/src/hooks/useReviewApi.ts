import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reviewApi } from "../api/reviewApi";
import type {
    ReviewRequest,
    ReviewFilterRequest,
} from "../types";

const REVIEWS_KEY = ["reviews"];
const REVIEW_KEY = ["review"];
const HOTEL_REVIEWS_KEY = ["hotelReviews"];

export const useReviewApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useReviews = (params: ReviewFilterRequest) =>
        useQuery({
            queryKey: [...REVIEWS_KEY, params],
            queryFn: () => reviewApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useReviewById = (id: string) =>
        useQuery({
            queryKey: [...REVIEW_KEY, id],
            queryFn: () => reviewApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= GET BY HOTEL =================
    const useReviewsByHotel = (
        hotelId: string,
        page = 0,
        size = 10
    ) =>
        useQuery({
            queryKey: [...HOTEL_REVIEWS_KEY, hotelId, page, size],
            queryFn: () => reviewApi.getByHotel(hotelId, page, size),
            enabled: !!hotelId,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createReview = useMutation({
        mutationFn: reviewApi.create,

        onSuccess: (res, variables) => {
            toast.success(res.message);

            // 🔥 refetch hotel reviews
            queryClient.invalidateQueries({
                queryKey: [HOTEL_REVIEWS_KEY, variables.hotelId],
            });
        },
    });

    // ================= UPDATE =================
    const updateReview = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: ReviewRequest;
        }) => reviewApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...REVIEW_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({
                queryKey: [HOTEL_REVIEWS_KEY, res.data.hotelId],
            });
        },
    });

    // ================= DELETE =================
    const deleteReview = useMutation({
        mutationFn: (id: string) => reviewApi.delete(id),

        onSuccess: () => {
            toast.success("Deleted successfully");

            queryClient.invalidateQueries({
                queryKey: HOTEL_REVIEWS_KEY,
            });
        },
    });

    return {
        useReviews,
        useReviewById,
        useReviewsByHotel,
        createReview,
        updateReview,
        deleteReview,
    };
};