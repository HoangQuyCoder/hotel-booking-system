package com.example.backend.mapper;

import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper extends BaseMapper<User, UserResponse> {

    @Mapping(source = "role.roleName", target = "roleName")
    UserResponse toResponse(User user);

    @Mapping(target = "password", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "resetTokenUsed", ignore = true)
    User toEntity(RegisterRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(UserUpdateRequest request, @MappingTarget User user);
}

