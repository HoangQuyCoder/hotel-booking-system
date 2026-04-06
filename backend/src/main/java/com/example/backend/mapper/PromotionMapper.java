package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.PromotionRequest;
import com.example.backend.dto.response.PromotionResponse;
import com.example.backend.model.Promotion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface PromotionMapper extends BaseMapper<Promotion, PromotionRequest, PromotionResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    Promotion toEntity(PromotionRequest request);
}
