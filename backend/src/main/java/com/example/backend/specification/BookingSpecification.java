package com.example.backend.specification;

import com.example.backend.dto.filter.BookingFilterRequest;
import com.example.backend.model.Booking;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class BookingSpecification {
    private static final Specification<Booking> spec = SpecUtils.empty();

    public static Specification<Booking> build(BookingFilterRequest filter) {

        return spec.and(SpecUtils.nestedEqualIfNotNull("user", "id", filter.getUserId()))
                .and(SpecUtils.nestedEqualIfNotNull("promotion", "id", filter.getPromotionId()))
                .and(SpecUtils.equalIfNotNull("status", filter.getStatus()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.betweenIfNotNull("checkInDate", filter.getCheckInFrom(), filter.getCheckInTo()))
                .and(SpecUtils.betweenIfNotNull("checkOutDate", filter.getCheckOutFrom(), filter.getCheckOutTo()))
                .and(SpecUtils.betweenIfNotNull("totalAmount", filter.getMinTotalAmount(), filter.getMaxTotalAmount()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()))
                .and(hasHotelId(filter.getHotelId()));
    }

    public static Specification<Booking> hasHotelId(UUID hotelId) {
        return (root, query, cb) -> {
            if (hotelId == null) return null;
            return cb.equal(root.join("bookingRooms").join("roomType").join("hotel").get("id"), hotelId);
        };
    }
}

