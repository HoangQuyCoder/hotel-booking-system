import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useRoomAmenityApi } from "../../../hooks/useRoomAmenityApi";
import { useRoomTypeApi } from "../../../hooks/useRoomTypeApi";
import type {
  RoomAmenityResponse,
  RoomAmenityRequest,
  RoomTypeListResponse,
} from "../../../types";

const schema = yup.object().shape({
  name: yup.string().required("Amenity name is required"),
  category: yup.string().required("Category is required"),
  roomTypeId: yup.string().required("Room type is required"),
});

interface RoomAmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: string;
  amenity?: RoomAmenityResponse | null;
}

export const RoomAmenityModal: React.FC<RoomAmenityModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  amenity,
}) => {
  const isEdit = !!amenity;
  const { createRoomAmenity, updateRoomAmenity } = useRoomAmenityApi();
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
    if (amenity && roomTypesData?.content) {
      const matchingType = roomTypesData.content.find(
        (rt: RoomTypeListResponse) => rt.name === amenity.roomTypeName,
      );

      reset({
        name: amenity.name,
        category: amenity.category,
        roomTypeId: matchingType?.id || "",
      });
    } else {
      reset({
        name: "",
        category: "GENERAL",
        roomTypeId: "",
      });
    }
  }, [amenity, reset, isOpen, roomTypesData?.content]);

  const onSubmit = async (data: RoomAmenityRequest) => {
    try {
      if (isEdit && amenity) {
        await updateRoomAmenity.mutateAsync({
          id: amenity.id,
          data: data as RoomAmenityRequest,
        });
      } else {
        await createRoomAmenity.mutateAsync(data as RoomAmenityRequest);
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
      title={isEdit ? "Edit Amenity" : "Add New Amenity"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Amenity Name (e.g. Free Wi-Fi, Coffee Machine)"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="GENERAL">General</option>
            <option value="BATHROOM">Bathroom</option>
            <option value="BEDROOM">Bedroom</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="KITCHEN">Kitchen</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">
            Apply to Room Type
          </label>
          <select
            {...register("roomTypeId")}
            className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
              errors.roomTypeId ? "border-red-500 ring-red-100" : ""
            }`}
          >
            <option value="">Select a room type</option>
            {roomTypesData?.content?.map((rt: RoomTypeListResponse) => (
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

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createRoomAmenity.isPending || updateRoomAmenity.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          >
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
