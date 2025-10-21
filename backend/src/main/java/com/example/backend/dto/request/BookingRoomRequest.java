package com.example.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class BookingRoomRequest {
    @NotNull
    private UUID roomTypeId;

    @NotNull
    private Integer quantity;

    private List<UUID> specificRoomIds;
}

