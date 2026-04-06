package com.example.backend.dto.response;

import com.example.backend.common.BookingStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
public class BookingListResponse extends BaseResponse {
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalAmount;
    private BookingStatus status;
    private String confirmationCode;
    private Integer guestCount;
    private String hotelName;
    private String notes;
}