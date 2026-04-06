import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { Plus, Trash2, Bed } from "lucide-react";
import { useBookingApi } from "../../../hooks/useBookingApi";
import { useHotelApi } from "../../../hooks/useHotelApi";
import { useRoomTypeApi } from "../../../hooks/useRoomTypeApi";
import type { BookingListResponse, BookingRequest } from "../../../types";

const schema = yup.object().shape({
  hotelId: yup.string().required("Hotel is required"),
  checkInDate: yup.string().required("Check-in date is required"),
  checkOutDate: yup.string().required("Check-out date is required"),
  guestCount: yup.number().min(1, "At least 1 guest").required(),
  notes: yup.string(),
  bookingRooms: yup
    .array()
    .of(
      yup.object().shape({
        roomTypeId: yup.string().required("Required"),
        quantity: yup.number().min(1, "Min 1").required(),
      }),
    )
    .min(1, "At least one room type"),
});

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking?: BookingListResponse | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const isEdit = !!booking;
  const { createBooking, updateBooking } = useBookingApi();
  const { useHotels } = useHotelApi();
  const { useRoomTypes } = useRoomTypeApi();

  const [selectedHotelId, setSelectedHotelId] = useState<string>("");

  const { data: hotelsData } = useHotels({ page: 0, size: 100 });
  const { data: roomTypesData } = useRoomTypes({
    hotelId: selectedHotelId,
    page: 0,
    size: 100,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bookingRooms: [{ roomTypeId: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bookingRooms",
  });

  const currentHotelId = watch("hotelId");

  useEffect(() => {
    setSelectedHotelId(currentHotelId);
  }, [currentHotelId]);

  useEffect(() => {
    if (booking) {
      // For Admin, full detail of booking is needed for edit
      // If booking is of type BookingListResponse, we might have limited info
      // Using reset to clear previous form when modal open
      reset({
        hotelId: "", // BookingListResponse may not have hotelId directly
        checkInDate: booking.checkInDate?.split("T")[0],
        checkOutDate: booking.checkOutDate?.split("T")[0],
        guestCount: booking.guestCount,
        notes: booking.notes || "",
        bookingRooms: [{ roomTypeId: "", quantity: 1 }],
      });
    } else {
      reset({
        hotelId: "",
        checkInDate: "",
        checkOutDate: "",
        guestCount: 1,
        notes: "",
        bookingRooms: [{ roomTypeId: "", quantity: 1 }],
      });
    }
  }, [booking, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && booking) {
        await updateBooking.mutateAsync({
          id: booking.id,
          data: data as BookingRequest,
        });
      } else {
        await createBooking.mutateAsync(data as BookingRequest);
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
      title={isEdit ? "Edit Booking" : "Create New Booking"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Hotel</label>
            <select
              {...register("hotelId")}
              className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                errors.hotelId ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Hotel</option>
              {hotelsData?.content?.map((h: any) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
            {errors.hotelId && (
              <p className="text-[11px] text-red-500">
                {errors.hotelId.message}
              </p>
            )}
          </div>

          <Input
            label="Guest Count"
            type="number"
            {...register("guestCount")}
            error={errors.guestCount?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Check-in Date"
            type="date"
            {...register("checkInDate")}
            error={errors.checkInDate?.message}
          />
          <Input
            label="Check-out Date"
            type="date"
            {...register("checkOutDate")}
            error={errors.checkOutDate?.message}
          />
        </div>

        {/* Room Types Dynamic Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Bed className="w-4 h-4 text-indigo-500" />
              Rooms Selection
            </label>
            <button
              type="button"
              onClick={() => append({ roomTypeId: "", quantity: 1 })}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-3 h-3" />
              Add Room Type
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-end gap-3 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <div className="flex-1">
                  <select
                    {...register(`bookingRooms.${index}.roomTypeId`)}
                    disabled={!selectedHotelId}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                  >
                    <option value="">Select Room Type</option>
                    {roomTypesData?.content?.map((rt: any) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    placeholder="Qty"
                    {...register(`bookingRooms.${index}.quantity`)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mb-0.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {errors.bookingRooms && (
              <p className="text-[11px] text-red-500">
                {errors.bookingRooms.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
            placeholder="Guest special requests..."
          />
        </div>

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createBooking.isPending || updateBooking.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
