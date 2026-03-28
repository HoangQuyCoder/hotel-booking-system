package com.example.backend.dto.response;

import java.time.LocalDate;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class BaseRateResponse extends BaseResponse {
    private Double basePrice;
    private LocalDate startDate;
    private LocalDate endDate;
}
