import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AdminModal } from "./AdminModal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useUserApi } from "../../../hooks/useUserApi";
import { useRoleApi } from "../../../hooks/useRoleApi";
import type {
  UserResponse,
  RegisterRequest,
  UserUpdateRequest,
  RoleResponse,
} from "../../../types";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().when("$isEdit", {
    is: false,
    then: (s) =>
      s
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    otherwise: (s) => s.notRequired(),
  }),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  roleName: yup.string().required("Role is required"),
});

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse | null;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const isEdit = !!user;
  const { createUser, updateUser } = useUserApi();
  const { useRoles } = useRoleApi();
  const { data: rolesData } = useRoles();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    context: { isEdit },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        roleName: user.roleName,
      });
    } else {
      reset({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        roleName: "",
      });
    }
  }, [user, reset, isOpen]);

  const onSubmit = async (data: unknown) => {
    try {
      if (isEdit && user) {
        await updateUser.mutateAsync({
          id: user.id,
          data: data as UserUpdateRequest,
        });
      } else {
        await createUser.mutateAsync(data as RegisterRequest);
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
      title={isEdit ? "Edit User" : "Add New User"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Email"
              {...register("email")}
              error={errors.email?.message}
              readOnly={isEdit}
              className={isEdit ? "bg-gray-50" : ""}
            />

            {!isEdit && (
              <Input
                label="Password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
              />
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">
                Role
              </label>
              <select
                {...register("roleName")}
                className={`w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.roleName ? "border-red-500 ring-red-100" : ""
                }`}
              >
                <option value="">Select a role</option>
                {rolesData?.map((role: RoleResponse) => (
                  <option key={role.id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.roleName && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">
                  {errors.roleName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Phone Number"
              {...register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />

            <Input
              label="Address"
              {...register("address")}
              error={errors.address?.message}
            />
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
            loading={createUser.isPending || updateUser.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold rounded-xl px-8 shadow-md shadow-indigo-100 transition-all"
          >
            {isEdit ? "Save Changes" : "Create User"}
          </Button>
        </div>
      </form>
    </AdminModal>
  );
};
