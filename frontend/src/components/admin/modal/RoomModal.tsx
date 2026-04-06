import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useRoomApi } from "../../../hooks/useRoomApi";
import { useRoomTypeApi } from "../../../hooks/useRoomTypeApi";
import type { RoomResponse, RoomRequest } from "../../../types";

const schema = yup.object().shape({
  roomNumber: yup.string().required("Room number is required"),
  roomTypeId: yup.string().required("Room type is required"),
  status: yup.string().required("Status is required"),
});

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  room?: RoomResponse | null;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  room,
}) => {
  const isEdit = !!room;
  const { createRoom, updateRoom } = useRoomApi();
  const { useRoomTypes } = useRoomTypeApi();
  const { data: roomTypesData } = useRoomTypes({ hotelId });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (room && roomTypesData?.content) {
      // Find matching ID by name since RoomResponse only has roomTypeName
      const matchingType = roomTypesData.content.find(
        (rt: any) => rt.name === room.roomTypeName,
      );

      reset({
        roomNumber: room.roomNumber,
        roomTypeId: matchingType?.id || "",
        status: room.status,
      });
    } else {
      reset({
        roomNumber: "",
        roomTypeId: "",
        status: "AVAILABLE",
      });
    }
  }, [room, reset, isOpen]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && room) {
        await updateRoom.mutateAsync({
          id: room.id,
          data: data as RoomRequest,
        });
      } else {
        await createRoom.mutateAsync(data as RoomRequest);
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
      title={isEdit ? "Edit Room" : "Add Room"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Room Number (e.g. 101, B02)"
          {...register("roomNumber")}
          error={errors.roomNumber?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Room Type
          </label>
          <select
            {...register("roomTypeId")}
            className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
              errors.roomTypeId ? "border-red-500 ring-red-100" : ""
            }`}
          >
            <option value="">Select a type</option>
            {roomTypesData?.content?.map((rt: any) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
          {errors.roomTypeId && (
            <p className="text-[11px] text-red-500 mt-1 font-medium">
              {errors.roomTypeId.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Status</label>
          <select
            {...register("status")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="AVAILABLE">Available</option>
            <option value="BOOKED">Booked</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createRoom.isPending || updateRoom.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
