package com.example.backend.dto.response;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class PromotionResponse extends BaseResponse {
    private String code;
    private Double discountPercent;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Integer maxUses;
    private Integer usedCount;
    private Double minBookingAmount;
}