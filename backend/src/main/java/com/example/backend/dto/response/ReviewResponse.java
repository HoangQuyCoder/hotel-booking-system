package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class ReviewResponse extends BaseResponse{
    private String name;
    private Integer rating;
    private String text;
    private UUID userId;
    private UUID hotelId;
}

