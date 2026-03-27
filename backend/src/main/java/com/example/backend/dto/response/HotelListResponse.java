package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class HotelListResponse extends BaseResponse {
    private String name;
    private String city;
    private String address;
    private Double rating;
    private String description;
    private String thumbnailUrl;
    private String checkInTime;
    private String checkOutTime;
}