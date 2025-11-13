package com.example.backend.mapper;

/**
 * BaseMapper là interface dùng cho tất cả mapper trong hệ thống.
 * @param <E> Entity
 * @param <R> Response DTO
 */
public interface BaseMapper<E, R> {

    R toResponse(E entity);
}

