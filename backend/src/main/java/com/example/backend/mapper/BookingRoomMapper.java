package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.BookingRoomRequest;
import com.example.backend.dto.response.BookingRoomResponse;
import com.example.backend.model.BookingRoom;
import org.mapstruct.Mapper;

@Mapper(config = BaseMapperConfig.class, uses = {
        RoomTypeMapper.class,
        BookingRoomDetailMapper.class
})
public interface BookingRoomMapper extends BaseMapper<BookingRoom, BookingRoomRequest, BookingRoomResponse> {
}
