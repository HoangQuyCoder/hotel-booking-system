package com.example.backend.utils;

import org.springframework.data.jpa.domain.Specification;

public class SpecUtils {
    public static <T> Specification<T> empty() {
        return (root, query, cb) -> cb.conjunction();
    }
}