import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { userApi } from "../api/userApi";
import type {
  UserUpdateRequest,
  UserFilterRequest,
  RegisterRequest,
} from "../types";

const USER_KEY = ["user"];
const USERS_KEY = ["users"];

export const useUserApi = () => {
  const queryClient = useQueryClient();

  // ================= GET CURRENT USER =================
  const useCurrentUser = () =>
    useQuery({
      queryKey: USER_KEY,
      queryFn: userApi.getMe,
      select: (res) => res.data,

      retry: (failureCount, error: unknown) => {
        if (
          (error as { response: { status: number } }).response?.status === 401
        )
          return false;
        return failureCount < 2;
      },

      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  // ================= GET USER BY ID =================
  const useUserById = (id: string) =>
    useQuery({
      queryKey: ["user", id],
      queryFn: () => userApi.getById(id),
      enabled: !!id,
      select: (res) => res.data,
    });

  // ================= GET ALL USERS =================
  const useUsers = (params: UserFilterRequest) =>
    useQuery({
      queryKey: [...USERS_KEY, params],
      queryFn: () => userApi.getAll(params),
      select: (res) => res.data,
    });

  // ================= CREATE USER =================
  const createUser = useMutation({
    mutationFn: (data: RegisterRequest) => userApi.create(data),

    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });

  // ================= UPDATE USER =================
  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserUpdateRequest }) =>
      userApi.update(id, data),

    onSuccess: (res, variables) => {
      toast.success(res.message);

      // update cache user detail
      queryClient.setQueryData(["user", variables.id], res.data);

      // update current user if it is the same user
      queryClient.setQueryData(USER_KEY, res.data);

      // invalidate list
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });

  // ================= DELETE USER =================
  const deleteUser = useMutation({
    mutationFn: (id: string) => userApi.delete(id),

    onSuccess: (res, id) => {
      toast.success(res.message);

      // remove cache
      queryClient.removeQueries({ queryKey: ["user", id] });

      // refetch list
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
  });

  return {
    useCurrentUser,
    useUserById,
    useUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
