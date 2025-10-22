package com.example.backend.specification;

import com.example.backend.dto.filter.RoomTypeFilterRequest;
import com.example.backend.model.RoomType;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class RoomTypeSpecification {
    private static final Specification<RoomType> spec = SpecUtils.empty();

    public static Specification<RoomType> build(RoomTypeFilterRequest filter) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("hotel", "id", filter.getHotelId()))
                .and(SpecUtils.likeIfNotNull("name", filter.getName()))
                .and(SpecUtils.equalIfNotNull("capacity", filter.getCapacity()))
                .and(SpecUtils.equalIfNotNull("isAvailable", filter.getIsAvailable()))
                .and(SpecUtils.greaterThanOrEqualIfNotNull("sizeSqm", filter.getMinSize()))
                .and(SpecUtils.lessThanOrEqualIfNotNull("sizeSqm", filter.getMaxSize()));
    }
}
