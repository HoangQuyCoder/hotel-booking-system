package com.example.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReviewResponse {
    private String id;
    private String name;
    private Integer rating;
    private String text;
    private UUID userId;
    private UUID hotelId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
