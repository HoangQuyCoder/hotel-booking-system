package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class BaseRateResponse extends BaseResponse{
    private Double basePrice;
    private LocalDate startDate;
    private LocalDate endDate;
}
