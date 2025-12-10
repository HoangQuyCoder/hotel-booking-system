package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class BookingRoomResponse {
    private UUID id;
    private Integer quantity;
    private UUID roomTypeId;
    private List<UUID> specificRoomIds;
    private Double pricePerNight;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
