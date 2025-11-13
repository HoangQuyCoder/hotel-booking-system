package com.example.backend.mapper;

import com.example.backend.dto.response.NotificationTemplateResponse;
import com.example.backend.model.NotificationTemplate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationTemplateMapper extends BaseMapper<NotificationTemplate, NotificationTemplateResponse> {
}

