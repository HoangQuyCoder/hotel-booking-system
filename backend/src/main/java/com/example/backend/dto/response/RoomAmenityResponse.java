package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RoomAmenityResponse extends BaseResponse {
    private String name;
    private String category;
    private String roomTypeName;
}