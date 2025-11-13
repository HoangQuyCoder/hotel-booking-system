package com.example.backend.mapper;

import com.example.backend.dto.response.RoomResponse;
import com.example.backend.model.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper extends BaseMapper<Room, RoomResponse> {
    RoomResponse toResponse(Room room);
}