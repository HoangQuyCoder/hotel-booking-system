package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface ReviewMapper extends BaseMapper<Review, ReviewRequest, ReviewResponse> {

    @Override
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "hotel.id", target = "hotelId")
    ReviewResponse toResponse(Review review);

    @Override
    @Mapping(target = "isActive", constant = "true")
    Review toEntity(ReviewRequest request);
}
