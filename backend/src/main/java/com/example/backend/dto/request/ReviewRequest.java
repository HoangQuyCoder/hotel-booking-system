package com.example.backend.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class ReviewRequest {
    private String name;
    private Integer rating;
    private String text;
    private UUID hotelId;
    private UUID userId;
}
