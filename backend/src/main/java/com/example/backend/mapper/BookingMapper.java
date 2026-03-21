package com.example.backend.mapper;

import com.example.backend.dto.request.BaseRateRequest;
import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.BookingResponse;
import com.example.backend.dto.response.BookingRoomResponse;
import com.example.backend.model.BaseRate;
import com.example.backend.model.Booking;
import com.example.backend.model.BookingRoom;
import org.mapstruct.*;

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

    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(target = "promotion", ignore = true)
    @Mapping(target = "bookingRooms", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    Booking toEntity(BookingRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(BookingRequest request, @MappingTarget Booking booking);
}

