package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class RoomTypeResponse extends BaseResponse{
    private String name;
    private Integer capacity;
    private Integer sizeSqm;
    private Integer totalRooms;
    private String description;
    private Boolean isAvailable;
    private List<RoomResponse> rooms;
    private List<RoomAmenityResponse> amenities;
    private List<BaseRateResponse> baseRates;
    private List<DailyOverrideResponse> dailyOverrides;
}