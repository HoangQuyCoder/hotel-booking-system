import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { userApi } from "../api/userApi";
import type { UserFilterRequest, UserUpdateRequest } from "../types";

export const USER_KEYS = {
  ALL: ["users"] as const,
  LIST: (f: UserFilterRequest) => [...USER_KEYS.ALL, "list", f] as const,
  DETAIL: (id: string) => [...USER_KEYS.ALL, "detail", id] as const,
  CURRENT: ["users", "me"] as const,
};

export const useUserApi = () => {
  const qc = useQueryClient();

  // ========= GET CURRENT USER ===============
  const useCurrentUser = () =>
    useQuery({
      queryKey: USER_KEYS.CURRENT,
      queryFn: userApi.getCurrentUser,
      retry: false,
      refetchInterval: 15 * 60 * 1000,
      staleTime: 1000 * 60 * 10,
    });

  // ========= GET USER BY ID ============
  const useUserById = (id: string) =>
    useQuery({
      queryKey: USER_KEYS.DETAIL(id),
      queryFn: () => userApi.getUserById(id),
      enabled: !!id,
    });

  // ======== GET ALL USERS ===========
  const useUsers = (filter: UserFilterRequest) =>
    useQuery({
      queryKey: USER_KEYS.LIST(filter),
      queryFn: () => userApi.getAllUsers(filter),
    });

  // ========= UPDATE USER ============
  const updateUser = useMutation({
    mutationFn: (vars: { id: string; body: UserUpdateRequest }) =>
      userApi.updateUser(vars.id, vars.body),

    onSuccess: (res, vars) => {
      toast.success(res.message);

      qc.invalidateQueries({ queryKey: USER_KEYS.DETAIL(vars.id) });
      qc.invalidateQueries({ queryKey: USER_KEYS.ALL });
      qc.invalidateQueries({ queryKey: USER_KEYS.CURRENT });
    },

    onError: () => {
      toast.error("Update failed");
    },
  });

  // ======== DELETE USER =========
  const deleteUser = useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),

    onSuccess: () => {
      toast.success("User deleted!");
      qc.invalidateQueries({ queryKey: USER_KEYS.ALL });
    },

    onError: () => {
      toast.error("Delete failed");
    },
  });

  return {
    // Queries
    useCurrentUser,
    useUserById,
    useUsers,

    // Mutations
    updateUser,
    deleteUser,
  };
};
