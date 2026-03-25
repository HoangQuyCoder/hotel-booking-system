package com.example.backend.dto.filter;

import com.example.backend.common.NotificationStatus;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationLogFilterRequest extends BaseFilterRequest {
    private String recipient;
    private UUID templateId;
    private NotificationStatus status;
    private String sourceEvent;
    private Boolean isActive;
    private Integer retryCount;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime sentFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime sentTo;

    private String keyword;
}
