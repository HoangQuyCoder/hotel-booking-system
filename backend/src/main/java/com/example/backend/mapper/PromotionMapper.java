package com.example.backend.mapper;

import com.example.backend.dto.response.PromotionResponse;
import com.example.backend.model.Promotion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromotionMapper extends BaseMapper<Promotion, PromotionResponse> {
    PromotionResponse toResponse(Promotion promotion);
}

