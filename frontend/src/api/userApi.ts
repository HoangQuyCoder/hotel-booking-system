import api from "../services/apiClient";
import type { ApiResponse, UserResponse } from "../types";

export const userApi = {
  me: () => api.get<ApiResponse<UserResponse>>("/users/me"),
};
