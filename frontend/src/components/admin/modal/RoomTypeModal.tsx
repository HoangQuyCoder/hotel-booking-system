import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useRoomTypeApi } from "../../../hooks/useRoomTypeApi";
import { useHotelApi } from "../../../hooks/useHotelApi";
import type {
  RoomTypeRequest,
  RoomTypeUpdateRequest,
  RoomTypeListResponse,
  HotelListResponse,
} from "../../../types";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  hotelId: yup.string().required("Hotel is required"),
  capacity: yup.number().min(1).required("Capacity is required"),
  sizeSqm: yup.number().min(1).required("Size is required"),
  totalRooms: yup.number().min(1).required("Total rooms is required"),
  description: yup.string().required("Description is required"),
});

interface RoomTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  roomType?: RoomTypeListResponse | null;
}

export const RoomTypeModal: React.FC<RoomTypeModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  roomType,
}) => {
  const isEdit = !!roomType;
  const { createRoomType, updateRoomType } = useRoomTypeApi();
  const { useHotels } = useHotelApi();
  const { data: hotelsData } = useHotels({ page: 0, size: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (roomType) {
      reset({
        name: roomType.name,
        capacity: roomType.capacity,
        sizeSqm: roomType.sizeSqm,
        totalRooms: roomType.totalRooms,
        description: roomType.description,
        hotelId: hotelId,
      });
    } else {
      reset({
        name: "",
        capacity: 2,
        sizeSqm: 25,
        totalRooms: 10,
        description: "",
        hotelId: hotelId,
      });
    }
  }, [roomType, reset, isOpen, hotelId]);

  const onSubmit = async (data: unknown) => {
    try {
      if (isEdit && roomType) {
        await updateRoomType.mutateAsync({
          id: roomType.id,
          data: data as RoomTypeUpdateRequest,
        });
      } else {
        await createRoomType.mutateAsync(data as RoomTypeRequest);
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
      title={isEdit ? "Edit Room Type" : "Add Room Type"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name (e.g. Deluxe Double Room)"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Hotel</label>
          <select
            {...register("hotelId")}
            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
              errors.hotelId ? "border-red-500" : "border-gray-200"
            }`}
          >
            <option value="">Select a hotel</option>
            {hotelsData?.content?.map((hotel: HotelListResponse) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          {errors.hotelId && (
            <p className="text-xs text-red-500">{errors.hotelId.message}</p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Capacity"
            type="number"
            {...register("capacity")}
            error={errors.capacity?.message}
          />
          <Input
            label="Size (m²)"
            type="number"
            {...register("sizeSqm")}
            error={errors.sizeSqm?.message}
          />
          <Input
            label="Total Rooms"
            type="number"
            {...register("totalRooms")}
            error={errors.totalRooms?.message}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
              errors.description ? "border-red-500 ring-red-100" : ""
            }`}
          />
          {errors.description && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createRoomType.isPending || updateRoomType.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
