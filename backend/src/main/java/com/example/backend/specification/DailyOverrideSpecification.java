package com.example.backend.specification;

import com.example.backend.dto.filter.DailyOverrideFilterRequest;
import com.example.backend.model.DailyOverride;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class DailyOverrideSpecification {

    private static final Specification<DailyOverride> spec = SpecUtils.empty();

    public static Specification<DailyOverride> build(DailyOverrideFilterRequest filterRequest) {
        return spec.and(SpecUtils.nestedEqualIfNotNull("roomType","id", filterRequest.getRoomTypeId()))
                .and(dateBetween(filterRequest.getFromDate(), filterRequest.getToDate()))
                .and(SpecUtils.betweenIfNotNull("priceAdjustment", filterRequest.getMinAdjustment(), filterRequest.getMaxAdjustment()))
                .and(SpecUtils.betweenIfNotNull("availableRooms", filterRequest.getMinAvailableRooms(), filterRequest.getMaxAvailableRooms()))
                .and(SpecUtils.equalIfNotNull("isActive", filterRequest.getIsActive()))
                .and(SpecUtils.betweenIfNotNull("createdAt", filterRequest.getCreatedFrom(), filterRequest.getCreatedTo()))
                .and(SpecUtils.betweenIfNotNull("updatedAt", filterRequest.getUpdatedFrom(), filterRequest.getUpdatedTo()));
    }

    private static Specification<DailyOverride> dateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("date"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("date"), from);
            return cb.lessThanOrEqualTo(root.get("date"), to);
        };
    }
}
