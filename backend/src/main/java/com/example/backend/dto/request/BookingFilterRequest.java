package com.example.backend.dto.request;

import com.example.backend.common.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingFilterRequest {
    private UUID userId;
    private UUID hotelId;
    private BookingStatus status;

    private LocalDate checkInFrom;
    private LocalDate checkInTo;

    private LocalDate checkOutFrom;
    private LocalDate checkOutTo;

    private Double minTotalAmount;
    private Double maxTotalAmount;

    private LocalDateTime createdFrom;
    private LocalDateTime createdTo;

    private LocalDateTime updatedFrom;
    private LocalDateTime updatedTo;

    private Boolean isActive;

    // Pagination & Sorting
    private int page = 0;
    private int size = 10;
    private String sortBy = "createdAt";
    private String direction = "DESC";
}
