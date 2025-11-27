import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";
import type { AxiosError } from "axios";

interface ApiError {
  message: string;
}

export const useAuthApi = () => {
  const queryClient = useQueryClient();

  const handleError = (err: AxiosError<ApiError>) =>
    toast.error(err.response?.data?.message ?? "Something went wrong");

  // ---------------- LOGIN ----------------
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.setQueryData(["user"], res.data);
    },
    onError: handleError,
  });

  // ---------------- LOGOUT ----------------
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      toast.info("Signed out successfully");
      queryClient.removeQueries(); // clear all cache
      queryClient.setQueryData(["user"], null);
    },
    onError: handleError,
  });

  // ---------------- REGISTER ----------------
  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (res, variables) => {
      toast.success(res.message);

      if (res.data) queryClient.setQueryData(["user"], res.data);

      // Auto login after registration
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
    onError: handleError,
  });

  // ---------------- SEND VERIFICATION CODE ----------------
  const sendVerificationCode = useMutation({
    mutationFn: authApi.sendVerificationCode,
    onSuccess: (res) => toast.success(res.message),
    onError: handleError,
  });

  // ---------------- VERIFY CODE ----------------
  const verifyCode = useMutation({
    mutationFn: authApi.verifyCode,
    onSuccess: (res) => toast.success(res.message),
    onError: handleError,
  });

  return {
    login,
    logout,
    register,
    sendVerificationCode,
    verifyCode,
  };
};
