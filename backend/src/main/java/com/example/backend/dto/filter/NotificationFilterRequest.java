package com.example.backend.dto.filter;

import com.example.backend.common.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationFilterRequest extends BaseFilterRequest {
    private String name;
    private NotificationType type;
    private String subject;
    private String content;
    private String defaultLanguage;
    private Integer priorityMin;
    private Integer priorityMax;
}
