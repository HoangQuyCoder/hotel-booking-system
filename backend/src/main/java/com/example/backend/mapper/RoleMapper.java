package com.example.backend.mapper;

import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.model.Role;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RoleMapper extends BaseMapper<Role, RoleResponse> {

    @Mapping(target = "isActive", constant = "true")
    Role toEntity(RoleRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(RoleRequest request, @MappingTarget Role role);
}