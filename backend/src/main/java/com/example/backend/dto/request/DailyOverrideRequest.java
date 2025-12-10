package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class DailyOverrideRequest {
    @NotNull(message = "Room type ID is required")
    private UUID roomTypeId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @PositiveOrZero(message = "Price adjustment must be non-negative")
    private Double priceAdjustment;

    @PositiveOrZero(message = "Available rooms must be non-negative")
    private Integer availableRooms;

    @Size(max = 255, message = "Reason must not exceed 255 characters")
    private String reason;
}
