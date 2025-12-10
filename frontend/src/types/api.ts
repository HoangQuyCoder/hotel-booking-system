import type { AxiosRequestConfig } from "axios";
export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  debugMessage?: string;
  fieldErrors?: FieldError[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  silent?: boolean;
  showSuccess?: boolean;
}
