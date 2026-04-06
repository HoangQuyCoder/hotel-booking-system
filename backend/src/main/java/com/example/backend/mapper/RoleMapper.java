package com.example.backend.mapper;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.model.Role;
import org.mapstruct.*;

@Mapper(config = BaseMapperConfig.class)
public interface RoleMapper extends BaseMapper<Role, RoleRequest, RoleResponse> {

    @Override
    @Mapping(target = "isActive", constant = "true")
    Role toEntity(RoleRequest request);
}