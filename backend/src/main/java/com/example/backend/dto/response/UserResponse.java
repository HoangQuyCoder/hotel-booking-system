package com.example.backend.dto.response;

import com.example.backend.common.RoleName;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private RoleName roleName;
    private String profilePictureUrl;
    private Boolean isActive;
    private String preferredLanguage;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private LocalDateTime lastLoginAt;
}
