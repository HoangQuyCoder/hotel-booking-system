package com.example.backend.dto.response;

import com.example.backend.common.NotificationType;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class NotificationTemplateResponse extends BaseResponse {
    private String name;
    private NotificationType type;
    private String subject;
    private String defaultLanguage;
    private String templateFile;
    private Integer priority;
}
