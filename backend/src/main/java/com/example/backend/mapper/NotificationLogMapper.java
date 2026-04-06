package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.NotificationLogRequest;
import com.example.backend.dto.response.NotificationLogResponse;
import com.example.backend.model.NotificationLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface NotificationLogMapper
        extends BaseMapper<NotificationLog, NotificationLogRequest, NotificationLogResponse> {

    @Override
    @Mapping(source = "template.name", target = "templateName")
    @Mapping(source = "template.id", target = "templateId")
    @Mapping(source = "user.id", target = "userId")
    NotificationLogResponse toResponse(NotificationLog log);
}
