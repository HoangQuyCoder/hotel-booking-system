package com.example.backend.utils;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collection;

public class SpecUtils {

    public static <T> Specification<T> empty() {
        return (root, query, cb) -> cb.conjunction();
    }

    /**
     * LIKE (case-insensitive) if value != null
     **/
    public static <T> Specification<T> likeIfNotNull(String field, String value) {
        if (value == null || value.isBlank()) return null;
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%");
    }

    /**
     * EQUAL if value != null
     **/
    public static <T> Specification<T> equalIfNotNull(String field, Object value) {
        if (value == null) return null;
        return (root, query, cb) -> cb.equal(root.get(field), value);
    }

    /**
     * GREATER_THAN_OR_EQUAL if value != null
     **/
    public static <T, Y extends Comparable<? super Y>> Specification<T> greaterThanOrEqualIfNotNull(String field, Y value) {
        if (value == null) return null;
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(field), value);
    }

    /**
     * LESS_THAN_OR_EQUAL if value != null
     **/
    public static <T, Y extends Comparable<? super Y>> Specification<T> lessThanOrEqualIfNotNull(String field, Y value) {
        if (value == null) return null;
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(field), value);
    }

    /**
     * BETWEEN if start or end != null
     **/
    public static <T, Y extends Comparable<? super Y>> Specification<T> betweenIfNotNull(String field, Y start, Y end) {
        if (start != null && end != null) {
            return (root, query, cb) -> cb.between(root.get(field), start, end);
        } else if (start != null) {
            return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get(field), start);
        } else if (end != null) {
            return (root, query, cb) -> cb.lessThanOrEqualTo(root.get(field), end);
        }
        return null;
    }

    /**
     * IN if collection != null and not empty
     **/
    public static <T> Specification<T> inIfNotEmpty(String field, Collection<?> values) {
        if (values == null || values.isEmpty()) return null;
        return (root, query, cb) -> root.get(field).in(values);
    }

    /**
     * NOT EQUAL if value != null
     **/
    public static <T> Specification<T> notEqualIfNotNull(String field, Object value) {
        if (value == null) return null;
        return (root, query, cb) -> cb.notEqual(root.get(field), value);
    }

    /**
     * NESTED EQUAL if field is in else relation
     **/
    public static <T> Specification<T> nestedEqualIfNotNull(String nestedPath, String field, Object value) {
        if (value == null) return null;
        return (root, query, cb) -> cb.equal(root.get(nestedPath).get(field), value);
    }

    /**
     * Search by keyword on multiple fields (nested field support)
     */
    public static <T> Specification<T> keywordSearch(String keyword, String... fields) {
        if (keyword == null || keyword.isBlank() || fields.length == 0) return null;

        return (root, query, cb) -> {
            String pattern = "%" + keyword.toLowerCase() + "%";

            Predicate[] predicates = Arrays.stream(fields)
                    .map(field -> {
                        if (field.contains(".")) {
                            // handle nested field
                            String[] parts = field.split("\\.");
                            Join<Object, Object> join = root.join(parts[0], JoinType.LEFT);
                            return cb.like(cb.lower(join.get(parts[1]).as(String.class)), pattern);
                        } else {
                            return cb.like(cb.lower(root.get(field).as(String.class)), pattern);
                        }
                    })
                    .toArray(Predicate[]::new);

            return cb.or(predicates);
        };
    }

    public static <T> Specification<T> dateBetweenIfNotNull(String field, LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get(field), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get(field), from);
            return cb.lessThanOrEqualTo(root.get(field), to);
        };
    }
}
