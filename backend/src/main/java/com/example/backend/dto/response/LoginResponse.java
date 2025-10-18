package com.example.backend.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token; // JWT token
    private UserResponse user;
}