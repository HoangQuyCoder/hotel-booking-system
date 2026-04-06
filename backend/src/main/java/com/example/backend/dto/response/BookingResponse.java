package com.example.backend.dto.response;

import com.example.backend.common.BookingStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class BookingResponse extends BaseResponse{
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalAmount;
    private BookingStatus status;
    private String confirmationCode;
    private Integer guestCount;
    private String notes;
    private UserListResponse user;
    private PromotionResponse promotion;
    private HotelListResponse hotel;
    private List<BookingRoomResponse> bookingRooms;
}
