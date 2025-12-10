import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";
import type { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const useAuthApi = () => {
  const queryClient = useQueryClient();

  // ---------------- COMMON HANDLERS ----------------
  const notifySuccess = (message?: string) => {
    if (message) toast.success(message);
  };

  const notifyError = (err: AxiosError<ApiError>) => {
    toast.error(err.response?.data?.message ?? "Something went wrong");
  };

  // ---------------- LOGIN ----------------
  const login = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: authApi.login,
    onSuccess: (res) => {
      notifySuccess(res.message);
      queryClient.setQueryData(["user"], res.data);
    },
    onError: notifyError,
  });

  // ---------------- LOGOUT ----------------
  const logout = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast.info("Signed out successfully");

      queryClient.removeQueries({ queryKey: ["user"], exact: true });

      queryClient.setQueryData(["user"], null);
    },
    onError: notifyError,
  });

  // ---------------- REGISTER ----------------
  const register = useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: authApi.register,
    onSuccess: async (res, variables) => {
      notifySuccess(res.message);

      if (res.data) queryClient.setQueryData(["user"], res.data);

      // Auto login
      try {
        const loginRes = await authApi.login({
          email: variables.email,
          password: variables.password,
        });
        queryClient.setQueryData(["user"], loginRes.data);
        toast.success("Logged in automatically!");
      } catch {
        toast.error("Registered but failed to login automatically.");
      }
    },
    onError: notifyError,
  });

  // ---------------- SEND VERIFICATION CODE ----------------
  const sendVerificationCode = useMutation({
    mutationKey: ["auth", "send-code"],
    mutationFn: authApi.sendVerificationCode,
    onSuccess: (res) => notifySuccess(res.message),
    onError: notifyError,
  });

  // ---------------- VERIFY CODE ----------------
  const verifyCode = useMutation({
    mutationKey: ["auth", "verify-code"],
    mutationFn: authApi.verifyCode,
    onSuccess: (res) => notifySuccess(res.message),
    onError: notifyError,
  });

  return {
    login,
    logout,
    register,
    sendVerificationCode,
    verifyCode,
  };
};
