package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.response.BookingRoomDetailResponse;
import com.example.backend.model.BookingRoomDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(config = BaseMapperConfig.class)
public interface BookingRoomDetailMapper extends BaseMapper<BookingRoomDetail, Void, BookingRoomDetailResponse> {

    @Override
    @Mapping(source = "bookingRoom.id", target = "bookingRoomId")
    @Mapping(source = "room.id", target = "roomId")
    BookingRoomDetailResponse toResponse(BookingRoomDetail detail);
}
