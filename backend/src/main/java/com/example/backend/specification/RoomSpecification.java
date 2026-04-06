package com.example.backend.specification;

import com.example.backend.dto.filter.RoomFilterRequest;
import com.example.backend.model.Room;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class RoomSpecification {
    private static final Specification<Room> spec = SpecUtils.empty();

    public static Specification<Room> build(RoomFilterRequest filter) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("roomType", "id", filter.getRoomTypeId()))
                .and(SpecUtils.nested2EqualIfNotNull("roomType", "hotel", "id", filter.getHotelId()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.likeIfNotNull("status", filter.getStatus()))
                .and(SpecUtils.likeIfNotNull("roomNumber", filter.getRoomNumber()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()));
    }
}
