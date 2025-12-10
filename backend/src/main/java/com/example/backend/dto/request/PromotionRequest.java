package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PromotionRequest {
    @NotBlank(message = "Code is required")
    @Size(max = 50, message = "Code must not exceed 50 characters")
    private String code;

    @NotNull(message = "Discount percent is required")
    @DecimalMin(value = "0.0", message = "Discount percent must be at least 0")
    @DecimalMax(value = "100.0", message = "Discount percent must not exceed 100")
    private Double discountPercent;

    @NotNull(message = "Valid from is required")
    private LocalDateTime validFrom;

    @NotNull(message = "Valid to is required")
    private LocalDateTime validTo;

    @Positive(message = "Max uses must be positive")
    private Integer maxUses;

    @PositiveOrZero(message = "Min booking amount must be non-negative")
    private Double minBookingAmount;
}