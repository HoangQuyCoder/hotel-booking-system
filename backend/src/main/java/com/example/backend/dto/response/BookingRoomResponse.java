package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class BookingRoomResponse extends BaseResponse{
    private Integer quantity;
    private RoomTypeListResponse roomType;
    private List<BookingRoomDetailResponse> bookingRoomDetails;
    private Double pricePerNight;
}
