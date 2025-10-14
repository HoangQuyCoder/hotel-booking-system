package com.example.backend.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token; // JWT token
    private UserResponse user;
}