import { AxiosError } from "axios";

/**
 * Error structure returned from backend (depending on API you can customize more)
 */
export interface ApiErrorResponse {
  message: string;
  status?: number;
  errors?: Record<string, string[]>; // Detailed errors by field (if any)
}

/**
 * Extract friendly error messages
 */
export function extractApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse;
    return apiError?.message || "Đã xảy ra lỗi máy chủ.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Yêu cầu thất bại.";
}
