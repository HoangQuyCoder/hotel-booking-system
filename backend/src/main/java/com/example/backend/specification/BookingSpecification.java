package com.example.backend.specification;

import com.example.backend.common.BookingStatus;
import com.example.backend.model.Booking;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public class BookingSpecification {

    public static Specification<Booking> hasUserId(UUID userId) {
        return (root, query, cb) -> userId == null ? null :
                cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Booking> hasHotelId(UUID hotelId) {
        return (root, query, cb) -> hotelId == null ? null :
                cb.equal(root.join("bookingRooms").join("roomType").join("hotel").get("id"), hotelId);
    }

    public static Specification<Booking> hasStatus(BookingStatus status) {
        return (root, query, cb) -> status == null ? null :
                cb.equal(root.get("status"), status);
    }

    public static Specification<Booking> hasCheckInBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("checkInDate"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("checkInDate"), from);
            return cb.lessThanOrEqualTo(root.get("checkInDate"), to);
        };
    }

    public static Specification<Booking> hasCheckOutBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("checkOutDate"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("checkOutDate"), from);
            return cb.lessThanOrEqualTo(root.get("checkOutDate"), to);
        };
    }

    public static Specification<Booking> hasTotalAmountBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min != null && max != null) return cb.between(root.get("totalAmount"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("totalAmount"), min);
            return cb.lessThanOrEqualTo(root.get("totalAmount"), max);
        };
    }

    public static Specification<Booking> hasCreatedBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("createdAt"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("createdAt"), from);
            return cb.lessThanOrEqualTo(root.get("createdAt"), to);
        };
    }

    public static Specification<Booking> hasUpdatedBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("updatedAt"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("updatedAt"), from);
            return cb.lessThanOrEqualTo(root.get("updatedAt"), to);
        };
    }

    public static Specification<Booking> isActive(Boolean active) {
        return (root, query, cb) -> active == null ? null :
                cb.equal(root.get("isActive"), active);
    }
}

