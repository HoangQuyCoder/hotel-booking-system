import { AxiosError } from "axios";
import type { ApiResponse, ApiError } from "../types/api";

export function extractApiErrorMessage(error: AxiosError): string {
  if (!error.response) {
    return "Unable to connect to server. Please try again!";
  }

  const data = error.response.data as ApiResponse<unknown>;
  const apiError: ApiError | undefined = data?.error;

  if (!apiError) {
    return data?.message || "An unknown error occurred.";
  }

  // If there are fieldErrors (validation errors)
  if (apiError.fieldErrors && apiError.fieldErrors.length > 0) {
    return apiError.fieldErrors
      .map((f) => `${f.field}: ${f.message}`)
      .join("\n");
  }

  // Prioritize friendly messages
  if (apiError.message) {
    return apiError.message;
  }

  // Fallback to debugMessage
  if (apiError.debugMessage) {
    return apiError.debugMessage;
  }

  // Final fallback
  return "An error occurred. Please try again!";
}
