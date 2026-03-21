package com.example.backend.mapper;

import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.BaseRateResponse;
import com.example.backend.model.BaseRate;
import com.example.backend.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BaseRateMapper extends BaseMapper<BaseRate, BaseRateResponse> {

    @Mapping(target = "roomType", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    BaseRate toEntity(BaseRateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(BaseRateRequest request, @MappingTarget BaseRate baseRate);
}
