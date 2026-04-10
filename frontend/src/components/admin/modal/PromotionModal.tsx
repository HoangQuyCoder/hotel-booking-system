import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { usePromotionApi } from "../../../hooks/usePromotionApi";
import type { PromotionResponse, PromotionRequest } from "../../../types";

const schema = yup.object().shape({
  code: yup.string().required("Promotion code is required").min(3, "Too short"),
  discountPercent: yup
    .number()
    .min(1, "Min 1%")
    .max(100, "Max 100%")
    .required(),
  validFrom: yup.string().required("Start date is required"),
  validTo: yup.string().required("End date is required"),
  maxUses: yup.number().min(1, "Min 1 use").required(),
  minBookingAmount: yup.number().min(0).required(),
});

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: PromotionResponse | null;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onClose,
  promotion,
}) => {
  const isEdit = !!promotion;
  const { createPromotion, updatePromotion } = usePromotionApi();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (promotion) {
      reset({
        code: promotion.code,
        discountPercent: promotion.discountPercent,
        validFrom: promotion.validFrom?.split("T")[0],
        validTo: promotion.validTo?.split("T")[0],
        maxUses: promotion.maxUses,
        minBookingAmount: promotion.minBookingAmount,
      });
    } else {
      reset({
        code: "",
        discountPercent: 10,
        validFrom: "",
        validTo: "",
        maxUses: 100,
        minBookingAmount: 0,
      });
    }
  }, [promotion, reset, isOpen]);

  const onSubmit = async (data: PromotionRequest) => {
    try {
      if (isEdit && promotion) {
        await updatePromotion.mutateAsync({
          id: promotion.id,
          data: data as PromotionRequest,
        });
      } else {
        await createPromotion.mutateAsync(data as PromotionRequest);
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
      title={isEdit ? "Edit Promotion" : "Create New Promotion"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Promo Code (e.g. SUMMER24)"
          {...register("code")}
          error={errors.code?.message}
          placeholder="ENTER_CODE"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Discount (%)"
            type="number"
            {...register("discountPercent")}
            error={errors.discountPercent?.message}
          />
          <Input
            label="Max Uses"
            type="number"
            {...register("maxUses")}
            error={errors.maxUses?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Valid From"
            type="date"
            {...register("validFrom")}
            error={errors.validFrom?.message}
          />
          <Input
            label="Valid To"
            type="date"
            {...register("validTo")}
            error={errors.validTo?.message}
          />
        </div>

        <Input
          label="Min Booking Amount (₫)"
          type="number"
          {...register("minBookingAmount")}
          error={errors.minBookingAmount?.message}
        />

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createPromotion.isPending || updatePromotion.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
