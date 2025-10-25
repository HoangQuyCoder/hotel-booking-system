package com.example.backend.specification;

import com.example.backend.dto.filter.RoomAmenityFilterRequest;
import com.example.backend.model.RoomAmenity;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class RoomAmenitySpecification {

    private static final Specification<RoomAmenity> spec = SpecUtils.empty();

    public static Specification<RoomAmenity> build(RoomAmenityFilterRequest filterRequest) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("roomType", "id", filterRequest.getRoomTypeId()))
                .and(SpecUtils.likeIfNotNull("category", filterRequest.getCategory()))
                .and(SpecUtils.likeIfNotNull("name", filterRequest.getName()))
                .and(SpecUtils.equalIfNotNull("isActive", filterRequest.getIsActive()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filterRequest.getCreatedFrom(), filterRequest.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filterRequest.getUpdatedFrom(), filterRequest.getUpdatedTo()));
    }
}
