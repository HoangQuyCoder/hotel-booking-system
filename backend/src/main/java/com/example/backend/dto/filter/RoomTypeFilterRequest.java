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
public class RoomTypeFilterRequest extends BaseFilterRequest {
    private UUID hotelId;
    private String name;
    private Integer capacity;
    private Boolean isAvailable;
    private Integer minSize;
    private Integer maxSize;
}
