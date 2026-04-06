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
public class HotelFilterRequest extends BaseFilterRequest {
    private String city;
    private String name;
    private String address;
    private Double minRating;
    private Double maxRating;
    private UUID managerId;
    private String keyword;
}