import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { extractApiErrorMessage } from "./apiError";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// Global error handler
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
