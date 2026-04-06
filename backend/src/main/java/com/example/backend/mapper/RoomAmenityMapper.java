package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.RoomAmenityRequest;
import com.example.backend.dto.response.RoomAmenityResponse;
import com.example.backend.model.RoomAmenity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface RoomAmenityMapper extends BaseMapper<RoomAmenity, RoomAmenityRequest, RoomAmenityResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    RoomAmenity toEntity(RoomAmenityRequest request);

    @Override
    @Mapping(source = "roomType.name", target = "roomTypeName")
    RoomAmenityResponse toResponse(RoomAmenity roomAmenity);
}
