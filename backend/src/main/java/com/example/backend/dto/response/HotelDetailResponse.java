package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class HotelDetailResponse {
    private UUID id;
    private String name;
    private String city;
    private String address;
    private Double rating;
    private String description;
    private String thumbnailUrl;
    private List<String> images;
    private ManagerResponse manager;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private String contactEmail;
    private String checkInTime;
    private String checkOutTime;
    private List<RoomTypeResponse> roomTypes;
    private List<ReviewResponse> reviews;
    private Boolean isActive;
}
