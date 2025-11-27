package com.example.backend.exception;

import com.example.backend.dto.response.ApiError;
import com.example.backend.dto.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Objects;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    // ------------------------------------------------------------------------
    // 1. Custom business exceptions
    // ------------------------------------------------------------------------

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(
                ApiResponse.error(ex.getMessage(),
                        ApiError.of("BAD_REQUEST", ex.getMessage()))
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.error(ex.getMessage(),
                        ApiError.of("NOT_FOUND", ex.getMessage()))
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error(ex.getMessage(),
                        ApiError.of("UNAUTHORIZED", ex.getMessage()))
        );
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<?>> handleForbidden(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                ApiResponse.error(ex.getMessage(),
                        ApiError.of("FORBIDDEN", ex.getMessage()))
        );
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<?>> handleConflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ApiResponse.error(ex.getMessage(),
                        ApiError.of("CONFLICT", ex.getMessage()))
        );
    }

    @ExceptionHandler(EmailSendException.class)
    public ResponseEntity<ApiResponse<?>> handleEmailSend(EmailSendException ex) {
        log.error("Email send failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("Failed to send email",
                        ApiError.of("EMAIL_SEND_FAILED", ex.getMessage()))
        );
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ApiResponse<?>> handleTokenExpired(TokenExpiredException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error("Token expired",
                        ApiError.of("TOKEN_EXPIRED", ex.getMessage()))
        );
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                ApiResponse.error("Invalid token",
                        ApiError.of("INVALID_TOKEN", ex.getMessage()))
        );
    }


    // ------------------------------------------------------------------------
    // 2. Validation errors
    // ------------------------------------------------------------------------

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException ex) {

        var errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> new ApiError.FieldError(
                        err.getField(),
                        err.getCode(),
                        err.getDefaultMessage()))
                .toList();

        return ResponseEntity.badRequest().body(
                ApiResponse.error("Invalid data",
                        ApiError.validationError(errors))
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<?>> handleConstraint(ConstraintViolationException ex) {

        var errors = ex.getConstraintViolations()
                .stream()
                .map(v -> new ApiError.FieldError(
                        v.getPropertyPath().toString(),
                        v.getConstraintDescriptor().getAnnotation()
                                .annotationType().getSimpleName(),
                        v.getMessage()))
                .toList();

        return ResponseEntity.badRequest().body(
                ApiResponse.error("Invalid data",
                        ApiError.validationError(errors))
        );
    }


    // ------------------------------------------------------------------------
    // 3. Common request errors
    // ------------------------------------------------------------------------

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<?>> handleMissingParams(MissingServletRequestParameterException ex) {
        return ResponseEntity.badRequest().body(
                ApiResponse.error("Missing request parameter",
                        ApiError.of("MISSING_PARAMETER",
                                ex.getParameterName() + " is required"))
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<?>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String message = ex.getName() + " must be type " + Objects.requireNonNull(ex.getRequiredType()).getSimpleName();
        return ResponseEntity.badRequest().body(
                ApiResponse.error("Invalid parameter type",
                        ApiError.of("TYPE_MISMATCH", message))
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<?>> handleInvalidJson(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(
                ApiResponse.error("Invalid request body",
                        ApiError.of("INVALID_JSON",
                                ex.getMostSpecificCause().getMessage()))
        );
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<?>> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(
                ApiResponse.error("Method not allowed",
                        ApiError.of("METHOD_NOT_ALLOWED", ex.getMessage()))
        );
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<?>> handleUnsupportedMedia(HttpMediaTypeNotSupportedException ex) {
        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(
                ApiResponse.error("Unsupported media type",
                        ApiError.of("UNSUPPORTED_MEDIA_TYPE", ex.getMessage()))
        );
    }


    // ------------------------------------------------------------------------
    // 4. General fallback exception
    // ------------------------------------------------------------------------

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAll(Exception ex) {
        log.error("Unhandled error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ApiResponse.error("An error occurred, please try again later",
                        ApiError.of("INTERNAL_ERROR",
                                "System error",
                                ex.getMessage()))
        );
    }
}
