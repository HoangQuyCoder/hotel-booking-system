package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class RoomAmenityResponse {
    private UUID id;
    private String name;
    private String category;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
}