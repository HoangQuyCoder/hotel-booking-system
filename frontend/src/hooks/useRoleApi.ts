import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleApi } from "../api/roleApi";
import { toast } from "react-toastify";
import type { RoleRequest } from "../types";

export const ROLE_KEYS = {
  ALL: ["roles"] as const,
  DETAIL: (id: string) => ["roles", id] as const,
};

export const useRoleApi = () => {
  const qc = useQueryClient();

  // =========== GET ALL ROLES ===============
  const useAllRoles = () =>
    useQuery({
      queryKey: ROLE_KEYS.ALL,
      queryFn: roleApi.getAllRoles,
      select: (res) => res.data,
    });

  // =========== GET ROLE BY ID ===============
  const useRole = (id: string) =>
    useQuery({
      queryKey: ROLE_KEYS.DETAIL(id),
      queryFn: () => roleApi.getRole(id),
      enabled: !!id,
      select: (res) => res.data,
    });

  // =========== CREATE ROLE =============
  const createRole = useMutation({
    mutationFn: roleApi.createRole,
    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ROLE_KEYS.ALL });
    },
    onError: () => {
      toast.error("Create role failed");
    },
  });

  // =========== UPDATE ROLE ===============
  const updateRole = useMutation({
    mutationFn: (vars: { id: number; data: RoleRequest }) =>
      roleApi.updateRole(vars.id, vars.data),

    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ROLE_KEYS.ALL });
      // invalidate detail if needed
      if (res.data?.id) {
        qc.invalidateQueries({ queryKey: ROLE_KEYS.DETAIL(res.data.id) });
      }
    },
    onError: () => {
      toast.error("Update role failed");
    },
  });

  // ========= DELETE ROLE ============
  const deleteRole = useMutation({
    mutationFn: (id: number) => roleApi.deleteRole(id),

    onSuccess: (res) => {
      toast.success(res.message);
      qc.invalidateQueries({ queryKey: ROLE_KEYS.ALL });
    },
    onError: () => {
      toast.error("Delete role failed");
    },
  });

  return {
    // queries
    useAllRoles,
    useRole,

    // mutations
    createRole,
    updateRole,
    deleteRole,
  };
};
