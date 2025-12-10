package com.example.backend.mapper;

import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.model.BaseRate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BaseRateMapper extends BaseMapper<BaseRate, BaseRateResponse> {

    BaseRateResponse toResponse(BaseRate baseRate);
}
