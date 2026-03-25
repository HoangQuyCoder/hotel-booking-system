package com.example.backend.dto.response;

import com.example.backend.common.NotificationStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationLogResponse extends BaseResponse{
    private String recipient;
    private UUID templateId;
    private String templateName;
    private NotificationStatus status;
    private String sourceEvent;
    private Map<String, Object> metadata;
    private LocalDateTime sentAt;
    private UUID userId;
    private UUID bookingId;
    private Integer retryCount;
    private String errorMessage;
}
