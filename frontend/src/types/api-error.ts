import { AxiosError } from "axios";

/**
 * Cấu trúc lỗi trả về từ backend (tùy API mà bạn có thể chỉnh thêm)
 */
export interface ApiErrorResponse {
  message: string;
  status?: number;
  errors?: Record<string, string[]>; // lỗi chi tiết theo field (nếu có)
}

/**
 * Trích xuất thông điệp lỗi thân thiện
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
