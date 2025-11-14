package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DailyOverrideResponse {
    private UUID id;
    private LocalDate date;
    private Double priceAdjustment;
    private Integer availableRooms;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
