package com.example.backend.dto.response;

import java.time.LocalDateTime;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        ApiError error,
        LocalDateTime timestamp
) {
    // success
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> success(T data) {
        return success("Successful", data);
    }

    public static ApiResponse<Void> ok(String message) {
        return new ApiResponse<>(true, message, null, null, LocalDateTime.now());
    }

    // error
    public static <T> ApiResponse<T> error(String message, ApiError error) {
        return new ApiResponse<>(false, message, null, error, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return error(message, null);
    }
}