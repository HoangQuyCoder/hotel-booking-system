import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../services/apiClient.ts";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CLIENT" | "STAFF" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  preferredLanguage: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient
        .get<{ user: User }>("/users/me")
        .then((res) => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const res = await apiClient.post<{ token: string; user: User }>(
        "/auths/login",
        credentials
      );
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      toast.success("Đăng nhập thành công!");
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "STAFF") navigate("/staff-dashboard");
      else navigate("/client-dashboard");
    } catch {
      toast.error("Đăng nhập thất bại");
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await apiClient.post("/auths/register", data);
      toast.success("Đăng ký thành công! Đang tự động đăng nhập...");
      await login({ email: data.email, password: data.password });
    } catch {
      toast.error("Đăng ký thất bại");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Đã đăng xuất");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
