package com.example.backend.mapper;

import com.example.backend.dto.response.HotelDetailResponse;
import com.example.backend.dto.response.HotelListResponse;
import com.example.backend.model.Hotel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {
        RoomTypeMapper.class,
        ReviewMapper.class
})
public interface HotelMapper extends  BaseMapper<Hotel, HotelDetailResponse> {

    @Mapping(source = "manager", target = "manager")
    HotelDetailResponse toResponse(Hotel hotel);

    HotelListResponse toListResponse(Hotel hotel);
}