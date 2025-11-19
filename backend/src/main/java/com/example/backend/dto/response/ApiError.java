package com.example.backend.dto.response;

import java.util.List;

public record ApiError(
        String code,
        String message,
        String debugMessage,
        List<FieldError> fieldErrors
) {
    public record FieldError(String field, String code, String message) {}

    public static ApiError of(String code, String message) {
        return new ApiError(code, message, null, null);
    }

    public static ApiError of(String code, String message, String debugMessage) {
        return new ApiError(code, message, debugMessage, null);
    }

    public static ApiError validationError(List<FieldError> errors) {
        return new ApiError("VALIDATION_ERROR", "Invalid data", null, errors);
    }
}