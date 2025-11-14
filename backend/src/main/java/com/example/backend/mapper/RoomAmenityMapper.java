package com.example.backend.mapper;

import com.example.backend.dto.response.RoomAmenityResponse;
import com.example.backend.model.RoomAmenity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomAmenityMapper extends BaseMapper<RoomAmenity, RoomAmenityResponse> {

    RoomAmenityResponse toResponse(RoomAmenity roomAmenity);
}
