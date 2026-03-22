package com.example.backend.mapper;

import com.example.backend.dto.response.NotificationLogResponse;
import com.example.backend.model.NotificationLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationLogMapper extends BaseMapper<NotificationLog, NotificationLogResponse> {

    @Mapping(source = "template.name", target = "templateName")
    @Mapping(source = "user.id", target = "userId")
    NotificationLogResponse toResponse(NotificationLog log);
}

