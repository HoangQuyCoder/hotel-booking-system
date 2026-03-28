package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.NotificationTemplateRequest;
import com.example.backend.dto.response.NotificationTemplateResponse;
import com.example.backend.model.NotificationTemplate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface NotificationTemplateMapper
                extends BaseMapper<NotificationTemplate, NotificationTemplateRequest, NotificationTemplateResponse> {

        @Override
        @Mapping(target = "priority", constant = "1")
        @Mapping(target = "isActive", constant = "true")
        NotificationTemplate toEntity(NotificationTemplateRequest request);
}
