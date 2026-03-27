import axios from "axios";
import type { ApiResponse } from "../types/api";

export function getApiErrorMessage(error: unknown): string {
    if (!axios.isAxiosError<ApiResponse<unknown>>(error)) {
        return error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
    }

    if (!error.response) {
        return "Unable to connect to server. Please try again!";
    }

    const data = error.response.data;
    const apiError = data?.error;

    return (
        apiError?.message ||
        data?.message ||
        "An error occurred. Please try again!"
    );
}