package com.example.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.model.BaseRate;

@Mapper(config = BaseMapperConfig.class)
public interface BaseRateMapper extends BaseMapper<BaseRate, BaseRateRequest, BaseRateResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    BaseRate toEntity(BaseRateRequest request);
}