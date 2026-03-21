package com.example.backend.mapper;

import java.util.List;

/**
 * BaseMapper is the interface used for all mappers in the system.
 * @param <E> Entity
 * @param <R> Response DTO
 */
public interface BaseMapper<E, R> {

    R toResponse(E entity);
    List<R> toResponseList(List<E> entities);
}

