package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class DailyOverrideResponse extends BaseResponse{
    private LocalDate date;
    private Double priceAdjustment;
    private Integer availableRooms;
    private String reason;
}
