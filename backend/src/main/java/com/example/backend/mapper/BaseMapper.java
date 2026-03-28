package com.example.backend.mapper;

import org.mapstruct.MappingTarget;
import java.util.List;

public interface BaseMapper<E, Req, Res> {

    // ==================== CREATE ====================
    E toEntity(Req request);

    // ==================== UPDATE ====================
    void updateEntity(Req request, @MappingTarget E entity);

    // ==================== RESPONSE ====================
    Res toResponse(E entity);

    List<Res> toResponseList(List<E> entities);
}