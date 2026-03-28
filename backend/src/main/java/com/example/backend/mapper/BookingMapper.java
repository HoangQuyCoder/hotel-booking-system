package com.example.backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.BookingRequest;
import com.example.backend.dto.response.BookingListResponse;
import com.example.backend.dto.response.BookingResponse;
import com.example.backend.model.Booking;

@Mapper(config = BaseMapperConfig.class, uses = {
        UserMapper.class,
        HotelMapper.class,
        PromotionMapper.class,
        RoomTypeMapper.class,
        BookingRoomMapper.class,
})
public interface BookingMapper extends BaseMapper<Booking, BookingRequest, BookingResponse> {

    // LIST
    @Mapping(source = "hotel.name", target = "hotelName")
    BookingListResponse toListResponse(Booking booking);

    List<BookingListResponse> toListResponseList(List<Booking> bookings);

    @Override
    @Mapping(target = "isActive", constant = "true")
    Booking toEntity(BookingRequest request);
}
