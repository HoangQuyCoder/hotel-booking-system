package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class BaseRateRequest {
    @NotNull(message = "Room type ID is required")
    private UUID roomTypeId;

    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private Double basePrice;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}
