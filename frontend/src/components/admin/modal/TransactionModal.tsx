import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useTransactionApi } from "../../../hooks/useTransactionApi";
import { useBookingApi } from "../../../hooks/useBookingApi";
import type { BookingListResponse, TransactionRequest } from "../../../types";

const schema = yup.object().shape({
  bookingId: yup.string().required("Booking ID is required"),
  amount: yup.number().min(0, "Amount must be positive").required(),
  currency: yup.string().required("Currency is required"),
  paymentMethod: yup.string().required("Payment method is required"),
  gatewayRef: yup.string(),
});

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createTransaction } = useTransactionApi();
  const { useBookings } = useBookingApi();
  const { data: bookingsData } = useBookings({ page: 0, size: 50 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bookingId: "",
      amount: 0,
      currency: "VND",
      paymentMethod: "CASH",
      gatewayRef: "",
    },
  });

  const onSubmit = async (data: unknown) => {
    try {
      await createTransaction.mutateAsync(data as TransactionRequest);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Manual Transaction"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Booking */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Link to Booking
          </label>
          <select
            {...register("bookingId")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Booking</option>
            {bookingsData?.content?.map((b: BookingListResponse) => (
              <option key={b.id} value={b.id}>
                #{b.confirmationCode} - {b.hotelName} (
                {b.totalAmount.toLocaleString()}₫)
              </option>
            ))}
          </select>
          {errors.bookingId && (
            <p className="text-[11px] text-red-500">
              {errors.bookingId.message}
            </p>
          )}
        </div>

        {/* Amount + Currency */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            {...register("amount")}
            error={errors.amount?.message}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Currency
            </label>
            <select
              {...register("currency")}
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Payment Method
          </label>
          <select
            {...register("paymentMethod")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="CASH">Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="VNPAY">VNPAY</option>
            <option value="MOMO">MOMO</option>
          </select>
        </div>

        {/* Gateway Ref */}
        <Input
          label="Gateway Reference (Optional)"
          {...register("gatewayRef")}
          placeholder="Momo Transaction ID, Bank Ref, etc."
        />

        {/* Actions */}
        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createTransaction.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            Record Payment
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
