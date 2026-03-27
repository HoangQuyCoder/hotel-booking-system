import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { bookingApi } from "../api/bookingApi";
import type {
    BookingRequest,
    BookingFilterRequest,
} from "../types";

const BOOKINGS_KEY = ["bookings"];
const BOOKING_KEY = ["booking"];

export const useBookingApi = () => {
    const queryClient = useQueryClient();

    // ================= GET ALL =================
    const useBookings = (params: BookingFilterRequest) =>
        useQuery({
            queryKey: [...BOOKINGS_KEY, params],
            queryFn: () => bookingApi.getAll(params),
            select: (res) => res.data,
        });

    // ================= GET BY ID =================
    const useBookingById = (id: string) =>
        useQuery({
            queryKey: [...BOOKING_KEY, id],
            queryFn: () => bookingApi.getById(id),
            enabled: !!id,
            select: (res) => res.data,
        });

    // ================= CREATE =================
    const createBooking = useMutation({
        mutationFn: bookingApi.create,

        onSuccess: (res) => {
            toast.success(res.message);

            // refetch list
            queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
    });

    // ================= UPDATE =================
    const updateBooking = useMutation({
        mutationFn: ({ id, data }: { id: string; data: BookingRequest }) => bookingApi.update(id, data),

        onSuccess: (res, variables) => {
            toast.success(res.message);

            // update cache detail
            queryClient.setQueryData(
                [...BOOKING_KEY, variables.id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
    });

    // ================= CANCEL =================
    const cancelBooking = useMutation({
        mutationFn: (id: string) => bookingApi.cancel(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            // remove cache detail
            queryClient.removeQueries({ queryKey: [...BOOKING_KEY, id] });

            queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
    });

    // ================= CHECK-IN =================
    const checkInBooking = useMutation({
        mutationFn: (id: string) => bookingApi.checkIn(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...BOOKING_KEY, id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
    });

    // ================= CHECK-OUT =================
    const checkOutBooking = useMutation({
        mutationFn: (id: string) => bookingApi.checkOut(id),

        onSuccess: (res, id) => {
            toast.success(res.message);

            queryClient.setQueryData(
                [...BOOKING_KEY, id],
                res.data
            );

            queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
    });

    return {
        useBookings,
        useBookingById,
        createBooking,
        updateBooking,
        cancelBooking,
        checkInBooking,
        checkOutBooking,
    };
};