package com.example.backend.specification;

import com.example.backend.dto.filter.HotelFilterRequest;
import com.example.backend.model.Hotel;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class HotelSpecification {
    private static final Specification<Hotel> spec = SpecUtils.empty();

    public static Specification<Hotel> build(HotelFilterRequest filter) {
        return spec.and(SpecUtils.keywordSearch(filter.getKeyword(), "name", "city", "address", "description"))
                .and(SpecUtils.likeIfNotNull("city", filter.getCity()))
                .and(SpecUtils.likeIfNotNull("name", filter.getName()))
                .and(SpecUtils.likeIfNotNull("address", filter.getAddress()))
                .and(SpecUtils.greaterThanOrEqualIfNotNull("rating", filter.getMinRating()))
                .and(SpecUtils.lessThanOrEqualIfNotNull("rating", filter.getMaxRating()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.nestedEqualIfNotNull("manager", "id", filter.getManagerId()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()));
    }
}
