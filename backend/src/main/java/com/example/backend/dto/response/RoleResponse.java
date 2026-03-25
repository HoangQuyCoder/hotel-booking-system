package com.example.backend.dto.response;

import com.example.backend.common.RoleName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class RoleResponse extends BaseResponse{
    private RoleName roleName;
    private String description;
}
