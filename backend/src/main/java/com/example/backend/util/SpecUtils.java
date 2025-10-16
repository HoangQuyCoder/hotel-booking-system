package com.example.backend.util;

import org.springframework.data.jpa.domain.Specification;

public class SpecUtils {
    public static <T> Specification<T> empty() {
        return (root, query, cb) -> cb.conjunction();
    }
}