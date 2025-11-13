package com.example.backend.mapper;

import com.example.backend.dto.response.RoleResponse;
import com.example.backend.model.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper extends BaseMapper<Role, RoleResponse> {
}
