package com.example.backend.dto.response;

import java.time.LocalDateTime;

public class ReviewResponse {
    private String id;
    private String name;
    private Integer rating;
    private String text;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
}
