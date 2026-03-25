package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class RoomTypeListResponse extends BaseResponse {
    private String name;
    private Integer capacity;
    private Integer sizeSqm;
    private Integer totalRooms;
    private Boolean isAvailable;
    private List<BaseRateResponse> baseRates;
    private List<DailyOverrideResponse> dailyOverrides;
}