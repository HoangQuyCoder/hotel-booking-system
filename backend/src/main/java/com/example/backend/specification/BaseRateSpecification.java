package com.example.backend.specification;

import com.example.backend.model.BaseRate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class BaseRateSpecification {

    public static Specification<BaseRate> hasRoomTypeId(UUID roomTypeId) {
        return (root, query, cb) ->
                roomTypeId == null ? null : cb.equal(root.get("roomType").get("id"), roomTypeId);
    }

    public static Specification<BaseRate> hasIsActive(Boolean isActive) {
        return (root, query, cb) ->
                isActive == null ? null : cb.equal(root.get("isActive"), isActive);
    }

    public static Specification<BaseRate> hasMinPrice(BigDecimal minPrice) {
        return (root, query, cb) ->
                minPrice == null ? null : cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice);
    }

    public static Specification<BaseRate> hasMaxPrice(BigDecimal maxPrice) {
        return (root, query, cb) ->
                maxPrice == null ? null : cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice);
    }

    public static Specification<BaseRate> overlapsDateRange(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null) return null;

            if (startDate != null && endDate != null) {
                // tìm các giá có hiệu lực giao nhau với khoảng thời gian được chọn
                return cb.and(
                        cb.lessThanOrEqualTo(root.get("startDate"), endDate),
                        cb.greaterThanOrEqualTo(root.get("endDate"), startDate)
                );
            } else if (startDate != null) {
                return cb.greaterThanOrEqualTo(root.get("endDate"), startDate);
            } else {
                return cb.lessThanOrEqualTo(root.get("startDate"), endDate);
            }
        };
    }
}
