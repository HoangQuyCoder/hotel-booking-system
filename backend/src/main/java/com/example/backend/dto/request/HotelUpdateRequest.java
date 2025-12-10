package com.example.backend.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class HotelUpdateRequest {
    private String name;
    private String city;
    private String address;
    private Double rating;
    private String description;
    private UUID managerId;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private String contactEmail;
    private String checkInTime;
    private String checkOutTime;
}
