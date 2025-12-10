package com.example.backend.dto.request;

import com.example.backend.common.RoleName;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoleRequest {
    @NotNull(message = "Role name must not be null")
    private RoleName roleName;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;
}
