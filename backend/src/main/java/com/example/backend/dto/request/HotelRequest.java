package com.example.backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class HotelRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must not exceed 255 characters")
    private String address;

    @DecimalMin(value = "0.0", message = "Rating must be at least 0")
    @DecimalMax(value = "5.0", message = "Rating must not exceed 5")
    private Double rating;

    private String description;

    private String thumbnailUrl;
    private List<String> images;

    @NotNull(message = "Manager ID is required")
    private UUID managerId;

    private Double latitude;
    private Double longitude;

    @NotBlank(message = "Contact phone is required")
    @Size(max = 20, message = "Contact phone must not exceed 20 characters")
    private String contactPhone;

    @NotBlank(message = "Contact email is required")
    @Size(max = 100, message = "Contact email must not exceed 100 characters")
    @Email(message = "Contact email must be valid")
    private String contactEmail;

    private String checkInTime;
    private String checkOutTime;
}