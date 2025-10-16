package com.example.backend.dto;

import com.example.backend.common.RoleName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoleResponse {
    private Long id;
    private String roleName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
