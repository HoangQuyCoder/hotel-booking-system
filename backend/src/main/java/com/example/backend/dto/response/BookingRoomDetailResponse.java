package com.example.backend.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingRoomDetailResponse {
    private UUID id;
    private UUID bookingRoomId;
    private UUID roomId;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
