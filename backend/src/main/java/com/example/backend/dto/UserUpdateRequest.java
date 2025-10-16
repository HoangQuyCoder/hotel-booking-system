package com.example.backend.dto;

import com.example.backend.common.RoleName;
import lombok.Data;

@Data
public class UserUpdateRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String preferredLanguage;
    private RoleName roleName;
}

