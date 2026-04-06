package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class HotelDetailResponse extends BaseResponse{
    private String name;
    private String city;
    private String address;
    private Double rating;
    private String description;
    private String thumbnailUrl;
    private List<String> images;
    private ManagerResponse manager;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private String contactEmail;
    private String checkInTime;
    private String checkOutTime;
    private List<RoomTypeResponse> roomTypes;
    private List<ReviewResponse> reviews;
}
