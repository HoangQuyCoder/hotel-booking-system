package com.example.backend.dto.response;

import com.example.backend.model.BookingRoom;
import com.example.backend.model.Promotion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingCalculationResult {
    private Promotion promotion;
    private List<BookingRoom> bookingRooms;
    private double totalAmount;
}

