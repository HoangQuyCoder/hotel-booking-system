package com.example.backend.mapper;

import com.example.backend.dto.response.RoomTypeResponse;
import com.example.backend.model.RoomType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {
        BaseRateMapper.class,
        DailyOverrideMapper.class,
        RoomAmenityMapper.class,
        RoomMapper.class
})
public interface RoomTypeMapper extends BaseMapper<RoomType, RoomTypeResponse> {

    RoomTypeResponse toResponse(RoomType roomType);
}

