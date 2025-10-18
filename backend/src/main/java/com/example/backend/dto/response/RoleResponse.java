package com.example.backend.dto.response;

import com.example.backend.common.RoleName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoleResponse {
    private Long id;
    private RoleName roleName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
