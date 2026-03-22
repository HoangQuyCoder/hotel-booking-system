package com.example.backend.mapper;

import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.BookingResponse;
import com.example.backend.dto.response.BookingRoomDetailResponse;
import com.example.backend.dto.response.BookingRoomResponse;
import com.example.backend.model.Booking;
import com.example.backend.model.BookingRoom;
import com.example.backend.model.BookingRoomDetail;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BookingMapper extends BaseMapper<Booking, BookingResponse> {

    // ===== BOOKING =====
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "hotel.id", target = "hotelId")
    @Mapping(source = "promotion.id", target = "promoId")
    @Mapping(source = "bookingRooms", target = "bookingRooms")
    BookingResponse toResponse(Booking booking);

    // ===== BOOKING ROOM =====
    @Mapping(source = "roomType.id", target = "roomTypeId")
    @Mapping(source = "bookingRoomDetails", target = "bookingRoomDetails")
    BookingRoomResponse toBookingRoomResponse(BookingRoom bookingRoom);

    List<BookingRoomResponse> toBookingRoomResponses(List<BookingRoom> bookingRooms);

    // ===== BOOKING ROOM DETAIL =====
    @Mapping(source = "bookingRoom.id", target = "bookingRoomId")
    @Mapping(source = "room.id", target = "roomId")
    BookingRoomDetailResponse toBookingRoomDetailResponse(BookingRoomDetail detail);

    List<BookingRoomDetailResponse> toBookingRoomDetailResponses(List<BookingRoomDetail> details);

    // ===== CREATE =====
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "hotel", ignore = true)
    @Mapping(target = "promotion", ignore = true)
    @Mapping(target = "bookingRooms", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    Booking toEntity(BookingRequest request);

    // ===== UPDATE =====
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(BookingRequest request, @MappingTarget Booking booking);
}

