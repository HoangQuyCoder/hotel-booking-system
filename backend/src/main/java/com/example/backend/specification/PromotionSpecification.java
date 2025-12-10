package com.example.backend.specification;

import com.example.backend.model.Promotion;
import com.example.backend.dto.filter.PromotionFilterRequest;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class PromotionSpecification {

    private static final Specification<Promotion> spec = SpecUtils.empty();

    public static Specification<Promotion> build(PromotionFilterRequest filter) {
        return spec.and(SpecUtils.likeIfNotNull("code", filter.getCode()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(validFromBeforeOrEqual(filter.getValidFrom()))
                .and(validToAfterOrEqual(filter.getValidTo()))
                .and(SpecUtils.lessThanOrEqualIfNotNull("minBookingAmount", filter.getMinBookingAmount()));
    }

    private static Specification<Promotion> validFromBeforeOrEqual(LocalDateTime validFrom) {
        return (root, query, cb) ->
                validFrom == null ? null : cb.lessThanOrEqualTo(root.get("validFrom"), validFrom);
    }

    private static Specification<Promotion> validToAfterOrEqual(LocalDateTime validTo) {
        return (root, query, cb) ->
                validTo == null ? null : cb.greaterThanOrEqualTo(root.get("validTo"), validTo);
    }
}
