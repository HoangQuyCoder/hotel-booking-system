package com.example.backend.dto.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DailyOverrideFilterRequest extends BaseFilterRequest {
    private UUID roomTypeId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal minAdjustment;
    private BigDecimal maxAdjustment;
    private Integer minAvailableRooms;
    private Integer maxAvailableRooms;
}
