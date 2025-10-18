package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class RoomTypeUpdateRequest {
    private String name;
    private Integer capacity;
    private Integer sizeSqm;
    private Integer totalRooms;
    private String description;

    @NotNull(message = "Hotel ID is required")
    private UUID hotelId;
}
