package com.example.backend.dto.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RoomFilterRequest extends BaseFilterRequest {
    private UUID roomTypeId;
    private UUID hotelId;
    private String status;
    private String roomNumber;
}
