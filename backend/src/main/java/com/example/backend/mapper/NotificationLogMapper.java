package com.example.backend.mapper;

import com.example.backend.dto.response.NotificationLogResponse;
import com.example.backend.model.NotificationLog;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Map;

@Mapper(componentModel = "spring")
public interface NotificationLogMapper extends BaseMapper<NotificationLog, NotificationLogResponse> {


    @Mapping(source = "template.name", target = "templateName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "metadata", target = "metadata", qualifiedByName = "parseJson")
    NotificationLogResponse toResponse(NotificationLog log);

    @Named("parseJson")
    default Map<String, Object> parseJson(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            return new ObjectMapper().readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            return null;
        }
    }
}

