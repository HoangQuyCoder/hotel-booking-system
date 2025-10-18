package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.UUID;

@Data
public class RoomRequest {
    @NotBlank(message = "Room number is required")
    @Size(max = 50, message = "Room number must not exceed 50 characters")
    private String roomNumber;

    @NotNull(message = "Room type ID is required")
    private UUID roomTypeId;

    @NotNull(message = "Status is required")
    private String status;
}
