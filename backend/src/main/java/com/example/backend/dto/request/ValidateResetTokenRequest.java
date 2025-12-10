package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidateResetTokenRequest {
    @NotBlank(message = "Token is required")
    private String token;
}
