import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import { AuthContext } from "./AuthContext";

import type { UserResponse } from "../types/user";
import type { RegisterRequest } from "../types/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Load user when app loads (using cookie authentication)
  useEffect(() => {
    userApi
      .me()
      .then((res) => {
        setUser(res.data.data ?? null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // LOGIN
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await authApi.login(credentials);

      const loggedUser = res.data.data; 
      setUser(loggedUser ?? null);

      toast.success(res.data.message);

      const roleName = loggedUser?.roleName;
      if (roleName === "ADMIN") navigate("/admin-dashboard");
      else if (roleName === "STAFF") navigate("/staff-dashboard");
      else navigate("/");
    } catch {
      toast.error("Login failed");
    }
  };

  // REGISTER
  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);

      toast.success("Registration successful");
      await login({ email: data.email, password: data.password });
    } catch {
      toast.error("Registration failed");
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await authApi.logout(); // BE removes cookie
    } catch {
      // ignore
    }

    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
