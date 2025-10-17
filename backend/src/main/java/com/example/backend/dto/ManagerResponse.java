package com.example.backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class ManagerResponse {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
}

