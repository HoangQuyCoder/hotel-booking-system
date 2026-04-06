import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Button } from "../../ui/Button";
import { Star } from "lucide-react";
import { useReviewApi } from "../../../hooks/useReviewApi";
import { useHotelApi } from "../../../hooks/useHotelApi";
import { useUserApi } from "../../../hooks/useUserApi";
import type { ReviewResponse, ReviewRequest } from "../../../types";

const schema = yup.object().shape({
  hotelId: yup.string().required("Hotel is required"),
  userId: yup.string().required("User is required"),
  rating: yup.number().min(1, "Min 1 star").max(5, "Max 5 stars").required(),
  text: yup
    .string()
    .required("Comment text is required")
    .min(10, "Comment too short"),
});

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review?: ReviewResponse | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  review,
}) => {
  const isEdit = !!review;
  const { createReview, updateReview } = useReviewApi();
  const { useHotels } = useHotelApi();
  const { useUsers } = useUserApi();

  const { data: hotelsData } = useHotels({ page: 0, size: 100 });
  const { data: usersData } = useUsers({ page: 0, size: 100 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const rating = watch("rating") || 0;

  useEffect(() => {
    if (review) {
      reset({
        hotelId: review.hotelId,
        userId: review.userId,
        rating: review.rating,
        text: review.text,
      });
    } else {
      reset({
        hotelId: "",
        userId: "",
        rating: 5,
        text: "",
      });
    }
  }, [review, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && review) {
        await updateReview.mutateAsync({
          id: review.id,
          data: data as ReviewRequest,
        });
      } else {
        await createReview.mutateAsync(data as ReviewRequest);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Review" : "Create Manual Review"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Hotel</label>
          <select
            {...register("hotelId")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Hotel</option>
            {hotelsData?.content?.map((h: any) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
          {errors.hotelId && (
            <p className="text-[11px] text-red-500">{errors.hotelId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            User (Reviewer)
          </label>
          <select
            {...register("userId")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select User</option>
            {usersData?.content?.map((u: any) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} ({u.email})
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="text-[11px] text-red-500">{errors.userId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setValue("rating", star)}
                className="p-1 transition-all hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-[11px] text-red-500">{errors.rating.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Comment</label>
          <textarea
            {...register("text")}
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Share guest's feedback..."
          />
          {errors.text && (
            <p className="text-[11px] text-red-500">{errors.text.message}</p>
          )}
        </div>

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createReview.isPending || updateReview.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Update" : "Save Review"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
