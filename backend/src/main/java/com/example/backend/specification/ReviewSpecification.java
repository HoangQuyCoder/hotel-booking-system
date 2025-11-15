package com.example.backend.specification;

import com.example.backend.dto.filter.ReviewFilterRequest;
import com.example.backend.model.Review;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class ReviewSpecification {
    private static final Specification<Review> spec = SpecUtils.empty();

    public static Specification<Review> build(ReviewFilterRequest filter) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("hotel", "id", filter.getHotelId()))
                .and(SpecUtils.nestedEqualIfNotNull("user", "id", filter.getUserId()))
                .and(SpecUtils.likeIfNotNull("name", filter.getName()))
                .and(SpecUtils.greaterThanOrEqualIfNotNull("rating", filter.getMinRating()))
                .and(SpecUtils.lessThanOrEqualIfNotNull("rating", filter.getMaxRating()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()));
    }
}
