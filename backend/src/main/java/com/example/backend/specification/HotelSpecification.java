package com.example.backend.specification;

import com.example.backend.model.Hotel;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

public class HotelSpecification {

    public static Specification<Hotel> hasCity(String city) {
        return (root, query, criteriaBuilder) ->
                city == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("city")), "%" + city.toLowerCase() + "%");
    }

    public static Specification<Hotel> hasName(String name) {
        return (root, query, criteriaBuilder) ->
                name == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Hotel> hasAddress(String address) {
        return (root, query, criteriaBuilder) ->
                address == null ? null : criteriaBuilder.like(criteriaBuilder.lower(root.get("address")), "%" + address.toLowerCase() + "%");
    }

    public static Specification<Hotel> hasManagerId(UUID managerId) {
        return (root, query, cb) -> {
            if (managerId == null) {
                return null;
            }
            return cb.equal(root.get("manager").get("id"), managerId);
        };
    }

    public static Specification<Hotel> hasRatingBetween(Double minRating, Double maxRating) {
        return (root, query, cb) -> {
            if (minRating != null && maxRating != null)
                return cb.between(root.get("rating"), minRating, maxRating);
            else if (minRating != null)
                return cb.greaterThanOrEqualTo(root.get("rating"), minRating);
            else if (maxRating != null)
                return cb.lessThanOrEqualTo(root.get("rating"), maxRating);
            else
                return null;
        };
    }

    public static Specification<Hotel> hasCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, cb) -> {
            if (startDate != null && endDate != null)
                return cb.between(root.get("createdAt"), startDate, endDate);
            else if (startDate != null)
                return cb.greaterThanOrEqualTo(root.get("createdAt"), startDate);
            else if (endDate != null)
                return cb.lessThanOrEqualTo(root.get("createdAt"), endDate);
            else
                return null;
        };
    }

    public static Specification<Hotel> keywordContains(String keyword) {
        String pattern = "%" + keyword.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("name")), pattern),
                cb.like(cb.lower(root.get("city")), pattern),
                cb.like(cb.lower(root.get("address")), pattern),
                cb.like(cb.lower(root.get("description")), pattern)
        );
    }

    public static Specification<Hotel> isActive(Boolean isActive) {
        return (root, query, criteriaBuilder) ->
                isActive == null ? null : criteriaBuilder.equal(root.get("isActive"), isActive);
    }
}
