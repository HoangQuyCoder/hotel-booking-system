package com.example.backend.specification.builder;

import com.example.backend.model.BaseRate;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class BaseRateSpecBuilder {

    public static Specification<BaseRate> build(
            UUID roomTypeId,
            Boolean isActive,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            LocalDate startDate,
            LocalDate endDate
    ) {
        Specification<BaseRate> spec = SpecUtils.empty();

        if (roomTypeId != null) {
            spec = spec.and(hasRoomTypeId(roomTypeId));
        }
        if (isActive != null) {
            spec = spec.and(hasIsActive(isActive));
        }
        if (minPrice != null) {
            spec = spec.and(hasPriceGreaterThanOrEqualTo(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(hasPriceLessThanOrEqualTo(maxPrice));
        }
        if (startDate != null) {
            spec = spec.and(hasStartDateBeforeOrEqual(startDate));
        }
        if (endDate != null) {
            spec = spec.and(hasEndDateAfterOrEqual(endDate));
        }

        return spec;
    }

    // --- Specification methods ---

    public static Specification<BaseRate> hasRoomTypeId(UUID roomTypeId) {
        return (root, query, cb) -> cb.equal(root.get("roomType").get("id"), roomTypeId);
    }

    public static Specification<BaseRate> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> cb.equal(root.get("isActive"), isActive);
    }

    public static Specification<BaseRate> hasPriceGreaterThanOrEqualTo(BigDecimal minPrice) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice);
    }

    public static Specification<BaseRate> hasPriceLessThanOrEqualTo(BigDecimal maxPrice) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice);
    }

    public static Specification<BaseRate> hasStartDateBeforeOrEqual(LocalDate startDate) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("startDate"), startDate);
    }

    public static Specification<BaseRate> hasEndDateAfterOrEqual(LocalDate endDate) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("endDate"), endDate);
    }
}
