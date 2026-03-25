package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RoomResponse extends BaseResponse{
    private String roomNumber;
    private String status;
}
