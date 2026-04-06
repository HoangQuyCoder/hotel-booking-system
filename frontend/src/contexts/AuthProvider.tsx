import { type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useAuthApi } from "../hooks/useAuthApi";
import { useUserApi } from "../hooks/useUserApi";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { logout: logoutMutation } = useAuthApi();
  const { useCurrentUser } = useUserApi();

  const { data: user, isLoading } = useCurrentUser();

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
