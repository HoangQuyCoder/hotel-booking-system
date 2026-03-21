package com.example.backend.mapper;

import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.request.DailyOverrideRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.response.DailyOverrideResponse;
import com.example.backend.model.BaseRate;
import com.example.backend.model.DailyOverride;
import com.example.backend.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface DailyOverrideMapper extends BaseMapper<DailyOverride, DailyOverrideResponse> {

    DailyOverrideResponse toResponse(DailyOverride dailyOverride);

    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "roomType", ignore = true)
    DailyOverride toEntity(DailyOverrideRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(DailyOverrideRequest request, @MappingTarget DailyOverride dailyOverride);
}
