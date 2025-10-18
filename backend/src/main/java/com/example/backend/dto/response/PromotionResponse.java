package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PromotionResponse {
    private UUID id;
    private String code;
    private Double discountPercent;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Integer maxUses;
    private Integer usedCount;
    private Double minBookingAmount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}