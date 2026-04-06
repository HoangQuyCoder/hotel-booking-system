package com.example.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.DailyOverrideRequest;
import com.example.backend.dto.response.DailyOverrideResponse;
import com.example.backend.model.DailyOverride;

@Mapper(config = BaseMapperConfig.class)
public interface DailyOverrideMapper extends BaseMapper<DailyOverride, DailyOverrideRequest, DailyOverrideResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    DailyOverride toEntity(DailyOverrideRequest request);
}
