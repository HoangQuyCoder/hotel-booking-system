package com.example.backend.specification.builder;

import com.example.backend.model.Hotel;
import com.example.backend.specification.HotelSpecification;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public class HotelSpecBuilder {
    private Specification<Hotel> spec = SpecUtils.empty();

    public HotelSpecBuilder city(String city) {
        if (city != null && !city.isBlank()) spec = spec.and(HotelSpecification.hasCity(city));
        return this;
    }

    public HotelSpecBuilder name(String name) {
        if (name != null && !name.isBlank()) spec = spec.and(HotelSpecification.hasName(name));
        return this;
    }

    public HotelSpecBuilder address(String address) {
        if (address != null && !address.isBlank()) spec = spec.and(HotelSpecification.hasAddress(address));
        return this;
    }

    public HotelSpecBuilder rating(Double min, Double max) {
        if (min != null || max != null)
            spec = spec.and(HotelSpecification.hasRatingBetween(
                    min != null ? min : 0.0,
                    max != null ? max : Double.MAX_VALUE));
        return this;
    }

    public HotelSpecBuilder createdAt(LocalDateTime start, LocalDateTime end) {
        if (start != null || end != null)
            spec = spec.and(HotelSpecification.hasCreatedAtBetween(start, end));
        return this;
    }

    public HotelSpecBuilder isActive(Boolean isActive) {
        if (isActive != null) spec = spec.and(HotelSpecification.isActive(isActive));
        return this;
    }

    public HotelSpecBuilder manager(UUID managerId) {
        if (managerId != null) spec = spec.and(HotelSpecification.hasManagerId(managerId));
        return this;
    }

    public Specification<Hotel> build() {
        return spec;
    }
}
