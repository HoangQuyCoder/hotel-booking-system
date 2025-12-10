package com.example.backend.specification;

import com.example.backend.dto.filter.BaseRateFilterRequest;
import com.example.backend.model.BaseRate;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

public class BaseRateSpecification {
    private static final Specification<BaseRate> spec = SpecUtils.empty();
    public static Specification<BaseRate> build(BaseRateFilterRequest filter) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("roomType", "id", filter.getRoomTypeId()))
                .and(SpecUtils.equalIfNotNull("isActive", filter.getIsActive()))
                .and(SpecUtils.greaterThanOrEqualIfNotNull("basePrice", filter.getMinPrice()))
                .and(SpecUtils.lessThanOrEqualIfNotNull("basePrice", filter.getMaxPrice()))
                .and(overlapsDateRange(filter.getStartDate(), filter.getEndDate()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filter.getCreatedFrom(), filter.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filter.getUpdatedFrom(), filter.getUpdatedTo()));
    }

    private static Specification<BaseRate> overlapsDateRange(
            java.time.LocalDate startDate,
            java.time.LocalDate endDate
    ) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null) return null;

            if (startDate != null && endDate != null) {
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
