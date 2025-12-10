package com.example.backend.dto.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ReviewFilterRequest extends BaseFilterRequest{
    private String name;
    private Double minRating;
    private Double maxRating;
    private String hotelId;
    private String userId;
}
