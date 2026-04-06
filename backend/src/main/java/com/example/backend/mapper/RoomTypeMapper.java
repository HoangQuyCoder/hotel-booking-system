package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.RoomTypeRequest;
import com.example.backend.dto.request.RoomTypeUpdateRequest;
import com.example.backend.dto.response.RoomTypeListResponse;
import com.example.backend.dto.response.RoomTypeResponse;
import com.example.backend.model.RoomType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(config = BaseMapperConfig.class, uses = {
        BaseRateMapper.class,
        DailyOverrideMapper.class,
        RoomAmenityMapper.class,
        RoomMapper.class
})
public interface RoomTypeMapper extends BaseMapper<RoomType, RoomTypeUpdateRequest, RoomTypeResponse> {

    // LIST
    RoomTypeListResponse toListResponse(RoomType roomType);

    List<RoomTypeListResponse> toListResponseList(List<RoomType> roomTypes);

    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "isAvailable", constant = "true")
    RoomType toEntity(RoomTypeRequest request);
}
