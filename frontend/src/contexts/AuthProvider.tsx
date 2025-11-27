import { type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";
import { AuthContext } from "./AuthContext";
import type { UserResponse } from "../types";
import { useAuthApi } from "../hooks/useAuthApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { logout: logoutMutation } = useAuthApi();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await apiClient.get<{ data: UserResponse }>("/users/me");
      return res.data.data;
    },
    retry: false,
    refetchInterval: 15 * 60 * 1000,
    staleTime: 1000 * 60 * 10,
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
