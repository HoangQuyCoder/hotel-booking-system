package com.example.backend.dto.response;

import com.example.backend.common.RoleName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserResponse extends BaseResponse {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private RoleName roleName;
    private String profilePictureUrl;
    private String preferredLanguage;
    private LocalDateTime lastLoginAt;
    private LocalDateTime lockedUntil;
    private Integer failedLoginAttempts;
}
