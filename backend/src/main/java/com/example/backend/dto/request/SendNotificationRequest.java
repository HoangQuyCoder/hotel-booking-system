package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class SendNotificationRequest {
    @NotNull
    private UUID templateId;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID bookingId;

    private String sourceEvent;

    @Size(max = 1000)
    private Map<String, Object> metadata;
}