import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useHotelApi } from "../../../hooks/useHotelApi";
import { useUserApi } from "../../../hooks/useUserApi";
import type {
  HotelDetailResponse,
  HotelRequest,
  HotelUpdateRequest,
  UserListResponse,
} from "../../../types";

const schema = yup.object().shape({
  name: yup.string().required("Hotel name is required"),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  rating: yup.number().min(0).max(5).required("Rating is required"),
  description: yup.string().required("Description is required"),
  thumbnailUrl: yup
    .string()
    .url("Invalid URL")
    .required("Thumbnail URL is required"),
  contactPhone: yup.string().required("Contact phone is required"),
  contactEmail: yup
    .string()
    .email("Invalid email")
    .required("Contact email is required"),
  managerId: yup.string().required("Manager is required"),
  checkInTime: yup.string().required("Check-in time is required"),
  checkOutTime: yup.string().required("Check-out time is required"),
  latitude: yup.number().required("Latitude is required"),
  longitude: yup.number().required("Longitude is required"),
});

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel?: HotelDetailResponse | null;
}

export const HotelModal: React.FC<HotelModalProps> = ({
  isOpen,
  onClose,
  hotel,
}) => {
  const isEdit = !!hotel;
  const { createHotel, updateHotel } = useHotelApi();
  const { useUsers } = useUserApi();
  // Fetch users with ROLE_MANAGER ideally, but here we just list users for now
  const { data: usersData } = useUsers({ page: 0, size: 100 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (hotel) {
      reset({
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        rating: hotel.rating,
        description: hotel.description,
        thumbnailUrl: hotel.thumbnailUrl,
        contactPhone: hotel.contactPhone,
        contactEmail: hotel.contactEmail,
        managerId: hotel.manager?.id || "",
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
      });
    } else {
      reset({
        name: "",
        city: "",
        address: "",
        rating: 5,
        description: "",
        thumbnailUrl: "",
        contactPhone: "",
        contactEmail: "",
        managerId: "",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        latitude: 10.762622,
        longitude: 106.660172,
      });
    }
  }, [hotel, reset, isOpen]);

  const onSubmit = async (data: HotelRequest | HotelUpdateRequest) => {
    try {
      if (isEdit && hotel) {
        await updateHotel.mutateAsync({
          id: hotel.id,
          data: data as HotelUpdateRequest,
        });
      } else {
        await createHotel.mutateAsync(data as HotelRequest);
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
      title={isEdit ? "Edit Hotel" : "Add New Hotel"}
      size="xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Basic Information
            </h4>
            <Input
              label="Hotel Name"
              {...register("name")}
              error={errors.name?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                {...register("city")}
                error={errors.city?.message}
              />
              <Input
                label="Rating (0-5)"
                type="number"
                step="0.1"
                {...register("rating")}
                error={errors.rating?.message}
              />
            </div>
            <Input
              label="Full Address"
              {...register("address")}
              error={errors.address?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.000001"
                {...register("latitude")}
                error={errors.latitude?.message}
              />
              <Input
                label="Longitude"
                type="number"
                step="0.000001"
                {...register("longitude")}
                error={errors.longitude?.message}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Contact & Management
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                {...register("contactPhone")}
                error={errors.contactPhone?.message}
              />
              <Input
                label="Email"
                {...register("contactEmail")}
                error={errors.contactEmail?.message}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Manager
              </label>
              <select
                {...register("managerId")}
                className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.managerId ? "border-red-500 ring-red-100" : ""
                }`}
              >
                <option value="">Select a manager</option>
                {usersData?.content?.map((u: UserListResponse) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
              {errors.managerId && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  {errors.managerId.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Check-in Time"
                type="time"
                {...register("checkInTime")}
                error={errors.checkInTime?.message}
              />
              <Input
                label="Check-out Time"
                type="time"
                {...register("checkOutTime")}
                error={errors.checkOutTime?.message}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            Media & Description
          </h4>
          <Input
            label="Thumbnail URL"
            {...register("thumbnailUrl")}
            error={errors.thumbnailUrl?.message}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Hotel Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                errors.description ? "border-red-500 ring-red-100" : ""
              }`}
              placeholder="Enter hotel detailed description..."
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            className="rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createHotel.isPending || updateHotel.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl px-8 shadow-md shadow-indigo-100 transition-all"
          >
            {isEdit ? "Save Changes" : "Create Hotel"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
