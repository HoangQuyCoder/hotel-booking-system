import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import { roleApi } from "../api/roleApi";
import type { RoleRequest } from "../types";

const ROLES_KEY = ["roles"];

export const useRoleApi = () => {
  const queryClient = useQueryClient();

  // ================= GET ALL =================
  const useRoles = () =>
    useQuery({
      queryKey: ROLES_KEY,
      queryFn: roleApi.getAll,
      select: (res) => res.data,
    });

  // ================= GET BY ID =================
  const useRoleById = (id: number) =>
    useQuery({
      queryKey: ["role", id],
      queryFn: () => roleApi.getById(id),
      enabled: !!id,
      select: (res) => res.data,
    });

  // ================= CREATE =================
  const createRole = useMutation({
    mutationFn: roleApi.create,

    onSuccess: (res) => {
      toast.success(res.message);

      // refetch list
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
    },
  });

  // ================= UPDATE =================
  const updateRole = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleRequest }) => roleApi.update(id, data),

    onSuccess: (res, variables) => {
      toast.success(res.message);

      // update cache detail
      queryClient.setQueryData(["role", variables.id], res.data);

      // refetch list
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
    },
  });

  // ================= DELETE =================
  const deleteRole = useMutation({
    mutationFn: (id: number) => roleApi.delete(id),

    onSuccess: (_, id) => {
      toast.success("Role deleted successfully");

      // remove cache
      queryClient.removeQueries({ queryKey: ["role", id] });

      // refetch list
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
    },
  });

  return {
    useRoles,
    useRoleById,
    createRole,
    updateRole,
    deleteRole,
  };
};