package com.example.backend.dto.filter;

import com.example.backend.common.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class BookingFilterRequest extends BaseFilterRequest {
    private UUID userId;
    private UUID hotelId;
    private UUID promotionId;
    private BookingStatus status;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkInFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkInTo;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkOutFrom;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate checkOutTo;

    private Double minTotalAmount;
    private Double maxTotalAmount;
}