package com.example.backend.specification.builder;

import com.example.backend.model.RoomType;
import com.example.backend.specification.RoomTypeSpecification;
import com.example.backend.utils.SpecUtils;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

public class RoomTypeSpecBuilder {

    private Specification<RoomType> spec;

    public RoomTypeSpecBuilder() {
        this.spec = SpecUtils.empty();
    }

    public RoomTypeSpecBuilder withHotelId(UUID hotelId) {
        if (hotelId != null) {
            spec = spec.and(RoomTypeSpecification.hasHotelId(hotelId));
        }
        return this;
    }

    public RoomTypeSpecBuilder withName(String name) {
        if (name != null && !name.isBlank()) {
            spec = spec.and(RoomTypeSpecification.hasName(name));
        }
        return this;
    }

    public RoomTypeSpecBuilder withCapacity(Integer capacity) {
        if (capacity != null) {
            spec = spec.and(RoomTypeSpecification.hasCapacity(capacity));
        }
        return this;
    }

    public RoomTypeSpecBuilder withAvailability(Boolean isAvailable) {
        if (isAvailable != null) {
            spec = spec.and(RoomTypeSpecification.hasAvailability(isAvailable));
        }
        return this;
    }

    public RoomTypeSpecBuilder withMinSize(Integer minSize) {
        if (minSize != null) {
            spec = spec.and(RoomTypeSpecification.hasSizeGreaterThan(minSize));
        }
        return this;
    }

    public RoomTypeSpecBuilder withMaxSize(Integer maxSize) {
        if (maxSize != null) {
            spec = spec.and(RoomTypeSpecification.hasSizeLessThan(maxSize));
        }
        return this;
    }

    public Specification<RoomType> build() {
        return spec;
    }
}
