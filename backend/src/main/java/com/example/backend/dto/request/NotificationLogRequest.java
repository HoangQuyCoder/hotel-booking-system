package com.example.backend.dto.request;

import java.util.Map;
import java.util.UUID;

import lombok.Data;

@Data
public class NotificationLogRequest {
    private String recipient;
    private String templateName;
    private String sourceEvent;
    private Map<String, Object> metadata;
    private UUID userId;
}
