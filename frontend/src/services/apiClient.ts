import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { extractApiErrorMessage } from "./apiError";
import type { CustomAxiosRequestConfig } from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig;

    if (config.showSuccess) {
      const message =
        response.data?.message ?? "Operation successful!";
      toast.success(message);
    }

    return response;
  },
  (error: AxiosError & { config?: CustomAxiosRequestConfig }) => {
    const config = error.config as CustomAxiosRequestConfig;

    if (!config?.silent) {
      toast.error(extractApiErrorMessage(error));
    }

    return Promise.reject(error);
  }
);

export default apiClient;