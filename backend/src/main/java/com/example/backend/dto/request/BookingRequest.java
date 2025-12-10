package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class BookingRequest {
    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;

    @NotNull(message = "Hotel ID is required")
    private UUID hotelId;

    @NotNull(message = "Booking Room are required")
    @Size(min = 1, message = "At least one room must be selected")
    private List<BookingRoomRequest> bookingRooms;

    @Positive(message = "Guest count must be positive")
    private Integer guestCount;

    private String notes;

    private String promoCode;
}
