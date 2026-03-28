package com.example.backend.dto.response;

import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class DailyOverrideResponse extends BaseResponse {
    private LocalDate date;
    private Double priceAdjustment;
    private Integer availableRooms;
    private String reason;
}
