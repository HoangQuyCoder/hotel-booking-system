package com.example.backend.mapper;

import com.example.backend.dto.request.ReviewRequest;
import com.example.backend.dto.response.ReviewResponse;
import com.example.backend.model.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper extends BaseMapper<Review, ReviewResponse> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "hotel.id", target = "hotelId")
    ReviewResponse toResponse(Review review);

    Review toEntity(ReviewRequest request);
}

