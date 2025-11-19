package com.example.backend.exception;

import com.example.backend.dto.response.ApiError;
import com.example.backend.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    // Errors thrown by yourself
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(),
                ApiError.of("BAD_REQUEST", ex.getMessage()));
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Not found: {}", ex.getMessage());
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(),
                ApiError.of("NOT_FOUND", ex.getMessage()));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(UnauthorizedException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(),
                ApiError.of("UNAUTHORIZED", ex.getMessage()));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<?>> handleForbidden(ForbiddenException ex) {
        ApiResponse<?> response = ApiResponse.error(ex.getMessage(),
                ApiError.of("FORBIDDEN", ex.getMessage()));
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    // 2. Validation error (Bean Validation - @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
        List<ApiError.FieldError> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new ApiError.FieldError(
                        err.getField(),
                        err.getCode(),
                        err.getDefaultMessage()))
                .toList();

        ApiResponse<?> response = ApiResponse.error("Invalid data",
                ApiError.validationError(errors));

        return ResponseEntity.badRequest().body(response);
    }

    // ConstraintViolationException
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<?>> handleConstraint(ConstraintViolationException ex) {
        List<ApiError.FieldError> errors = ex.getConstraintViolations().stream()
                .map(v -> new ApiError.FieldError(
                        v.getPropertyPath().toString(),
                        v.getConstraintDescriptor().getAnnotation().annotationType().getSimpleName(),
                        v.getMessage()))
                .toList();

        ApiResponse<?> response = ApiResponse.error("Invalid data",
                ApiError.validationError(errors));

        return ResponseEntity.badRequest().body(response);
    }

    // 4. General exception (server error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAll(Exception ex) {
        log.error("Unknown error", ex);
        ApiResponse<?> response = ApiResponse.error("An error occurred, please try again later",
                ApiError.of("INTERNAL_ERROR", "System error", ex.getMessage()));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}