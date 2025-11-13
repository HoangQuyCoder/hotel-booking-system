package com.example.backend.mapper;

import com.example.backend.dto.response.DailyOverrideResponse;
import com.example.backend.model.DailyOverride;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DailyOverrideMapper extends BaseMapper<DailyOverride, DailyOverrideResponse> {
    DailyOverrideResponse toResponse(DailyOverride dailyOverride);
}
