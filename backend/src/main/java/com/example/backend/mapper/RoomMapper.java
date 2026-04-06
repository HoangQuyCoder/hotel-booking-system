package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.RoomRequest;
import com.example.backend.dto.response.RoomResponse;
import com.example.backend.model.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface RoomMapper extends BaseMapper<Room, RoomRequest, RoomResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    Room toEntity(RoomRequest request);

    @Override
    @Mapping(source = "roomType.name", target = "roomTypeName")
    RoomResponse toResponse(Room room);
}