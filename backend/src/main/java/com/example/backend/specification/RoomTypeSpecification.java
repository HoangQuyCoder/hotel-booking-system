package com.example.backend.specification;

import com.example.backend.model.RoomType;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class RoomTypeSpecification {

    public static Specification<RoomType> hasHotelId(UUID hotelId) {
        return (root, query, cb) ->
                hotelId == null ? null : cb.equal(root.get("hotel").get("id"), hotelId);
    }

    public static Specification<RoomType> hasName(String name) {
        return (root, query, cb) ->
                (name == null || name.isEmpty()) ? null : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<RoomType> hasCapacity(Integer capacity) {
        return (root, query, cb) ->
                capacity == null ? null : cb.equal(root.get("capacity"), capacity);
    }

    public static Specification<RoomType> hasAvailability(Boolean isAvailable) {
        return (root, query, cb) ->
                isAvailable == null ? null : cb.equal(root.get("isAvailable"), isAvailable);
    }

    public static Specification<RoomType> hasSizeGreaterThan(Integer minSize) {
        return (root, query, cb) ->
                minSize == null ? null : cb.greaterThanOrEqualTo(root.get("sizeSqm"), minSize);
    }

    public static Specification<RoomType> hasSizeLessThan(Integer maxSize) {
        return (root, query, cb) ->
                maxSize == null ? null : cb.lessThanOrEqualTo(root.get("sizeSqm"), maxSize);
    }
}
