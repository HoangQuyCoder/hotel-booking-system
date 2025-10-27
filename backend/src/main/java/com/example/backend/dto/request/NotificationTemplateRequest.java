package com.example.backend.dto.request;

import com.example.backend.common.NotificationType;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class NotificationTemplateRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotNull
    private NotificationType type;

    @Size(max = 255)
    private String subject;

    @NotBlank(message = "Template file is required")
    private String templateFile;

    @Size(max = 10)
    private String defaultLanguage;

    @Min(0)
    @Max(10)
    private Integer priority;
}
