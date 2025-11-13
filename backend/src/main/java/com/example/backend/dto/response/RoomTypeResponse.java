package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class RoomTypeResponse {
    private UUID id;
    private String name;
    private Integer capacity;
    private Integer sizeSqm;
    private Integer totalRooms;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isAvailable;
    private Boolean isActive;
    private UUID hotelId;
    private List<RoomAmenityResponse> roomAmenityResponseList;
}