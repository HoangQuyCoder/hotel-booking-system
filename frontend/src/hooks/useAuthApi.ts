import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";
import type { UserResponse } from "../types";

const USER_KEY = ["user"];

export const useAuthApi = () => {
  const queryClient = useQueryClient();

  const setUser = (user: UserResponse | null) => {
    queryClient.setQueryData(USER_KEY, user);
    queryClient.invalidateQueries({
      queryKey: USER_KEY,
      exact: true,
    });
  };

  const clearUser = () => {
    queryClient.setQueryData(["user"], null);
    queryClient.removeQueries({ queryKey: ["user"], exact: true });
  };

  // ================= LOGIN =================
  const login = useMutation({
    mutationFn: authApi.login,

    onSuccess: (res) => {
      setUser(res.data);
      if (res.message) toast.success(res.message);
    },
  });

  // ================= LOGOUT =================
  const logout = useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      clearUser();
      toast.info("Signed out successfully");
    },
  });

  // ================= REGISTER =================
  const register = useMutation({
    mutationFn: authApi.register,

    onSuccess: (res) => {
      setUser(res.data);
      if (res.message) toast.success(res.message);
    },
  });

  // ================= SEND CODE =================
  const sendCode = useMutation({
    mutationFn: authApi.sendVerificationCode,

    onSuccess: (res) => {
      if (res.message) toast.success(res.message);
    },
  });

  // ================= VERIFY =================
  const verifyCode = useMutation({
    mutationFn: authApi.verifyCode,

    onSuccess: (res) => {
      if (res.message) toast.success(res.message);
    },
  });

  const forgotPassword = useMutation({
    mutationFn: authApi.forgotPassword,

    onSuccess: (res) => {
      if (res.message) toast.success(res.message);
    },
  });

  const validateResetToken = useMutation({
    mutationFn: authApi.validateResetToken,

    onSuccess: (res) => {
      if (res.message) toast.success(res.message);
    },
  });

  const resetPassword = useMutation({
    mutationFn: authApi.resetPassword,

    onSuccess: (res) => {
      if (res.message) toast.success(res.message);
    },
  });

  return {
    login,
    logout,
    register,
    sendCode,
    verifyCode,
    forgotPassword,
    validateResetToken,
    resetPassword,
  };
};
