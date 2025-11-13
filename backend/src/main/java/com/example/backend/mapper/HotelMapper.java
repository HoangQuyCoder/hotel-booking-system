package com.example.backend.mapper;

import com.example.backend.dto.response.HotelDetailResponse;
import com.example.backend.dto.response.ManagerResponse;
import com.example.backend.model.Hotel;
import com.example.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring", uses = {
        RoomTypeMapper.class,
        ReviewMapper.class
})
public interface HotelMapper extends  BaseMapper<Hotel, HotelDetailResponse> {
    @Mapping(source = "manager", target = "manager")
    HotelDetailResponse toResponse(Hotel hotel);

    ManagerResponse toManagerResponse(User manager);

    List<HotelDetailResponse> toResponses(List<Hotel> hotels);
}

