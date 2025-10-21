package com.example.backend.dto.response;

import com.example.backend.common.BookingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class BookingResponse {
    private UUID id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalAmount;
    private BookingStatus status;
    private String confirmationCode;
    private Integer guestCount;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Boolean isActive;
    private UUID userId;
    private UUID promoId;
    private List<BookingRoomResponse> bookingRooms;
}
