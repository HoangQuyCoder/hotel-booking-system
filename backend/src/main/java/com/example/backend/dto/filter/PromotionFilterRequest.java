package com.example.backend.dto.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PromotionFilterRequest extends BaseFilterRequest {
    private String code;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private BigDecimal minBookingAmount;
}
