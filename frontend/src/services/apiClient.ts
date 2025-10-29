import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { extractApiErrorMessage } from "../types/api-error";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor: tự động thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor: xử lý lỗi toàn cục
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError & { config?: { silent?: boolean } }) => {
    if (!error.config?.silent) {
      toast.error(extractApiErrorMessage(error));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
