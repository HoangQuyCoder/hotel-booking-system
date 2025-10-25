package com.example.backend.dto.response;

import com.example.backend.common.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class NotificationTemplateResponse {
    private UUID id;
    private String name;
    private NotificationType type;
    private String subject;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
    private String defaultLanguage;
    private Integer priority;
}
