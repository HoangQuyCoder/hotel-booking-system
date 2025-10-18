package com.example.backend.specification.builder;

import com.example.backend.model.Promotion;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PromotionSpecBuilder {

    public static Specification<Promotion> build(
            String code,
            Boolean isActive,
            LocalDateTime validFrom,
            LocalDateTime validTo,
            BigDecimal minBookingAmount
    ) {
        Specification<Promotion> spec = SpecUtils.empty();

        if (code != null && !code.isBlank()) {
            spec = spec.and(hasCodeLike(code));
        }
        if (isActive != null) {
            spec = spec.and(hasIsActive(isActive));
        }
        if (validFrom != null) {
            spec = spec.and(hasValidFromBeforeOrEqual(validFrom));
        }
        if (validTo != null) {
            spec = spec.and(hasValidToAfterOrEqual(validTo));
        }
        if (minBookingAmount != null) {
            spec = spec.and(hasMinBookingAmountLessThanOrEqual(minBookingAmount));
        }

        return spec;
    }

    // --- Filter methods ---
    private static Specification<Promotion> hasCodeLike(String code) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("code")), "%" + code.toLowerCase() + "%");
    }

    private static Specification<Promotion> hasIsActive(Boolean isActive) {
        return (root, query, cb) -> cb.equal(root.get("isActive"), isActive);
    }

    private static Specification<Promotion> hasValidFromBeforeOrEqual(LocalDateTime validFrom) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("validFrom"), validFrom);
    }

    private static Specification<Promotion> hasValidToAfterOrEqual(LocalDateTime validTo) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("validTo"), validTo);
    }

    private static Specification<Promotion> hasMinBookingAmountLessThanOrEqual(BigDecimal minAmount) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("minBookingAmount"), minAmount);
    }
}

