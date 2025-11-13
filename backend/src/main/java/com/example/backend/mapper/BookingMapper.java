package com.example.backend.mapper;

import com.example.backend.dto.response.BookingResponse;
import com.example.backend.dto.response.BookingRoomResponse;
import com.example.backend.model.Booking;
import com.example.backend.model.BookingRoom;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookingMapper extends BaseMapper<Booking, BookingResponse> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "promotion.id", target = "promoId")
    @Mapping(source = "bookingRooms", target = "bookingRooms")
    BookingResponse toResponse(Booking booking);

    @Mapping(source = "roomType.id", target = "roomTypeId")
    BookingRoomResponse toBookingRoomResponse(BookingRoom bookingRoom);

    List<BookingRoomResponse> toBookingRoomResponses(List<BookingRoom> bookingRooms);
}

