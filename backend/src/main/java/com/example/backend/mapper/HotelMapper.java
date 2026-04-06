package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.HotelRequest;
import com.example.backend.dto.request.HotelUpdateRequest;
import com.example.backend.dto.response.HotelDetailResponse;
import com.example.backend.dto.response.HotelListResponse;
import com.example.backend.model.Hotel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = BaseMapperConfig.class, uses = {
        RoomTypeMapper.class,
        ReviewMapper.class
})
public interface HotelMapper extends BaseMapper<Hotel, HotelUpdateRequest, HotelDetailResponse> {

    // LIST
    HotelListResponse toListResponse(Hotel hotel);

    List<HotelListResponse> toListResponseList(List<Hotel> hotels);

    @Mapping(target = "isActive", constant = "true")
    Hotel toEntity(HotelRequest request);
}