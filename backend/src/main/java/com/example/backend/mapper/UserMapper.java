package com.example.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.config.BaseMapperConfig;
import com.example.backend.dto.request.RegisterRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;

@Mapper(config = BaseMapperConfig.class)
public interface UserMapper extends BaseMapper<User, UserUpdateRequest, UserResponse> {

    @Override
    @Mapping(source = "role.roleName", target = "roleName")
    UserResponse toResponse(User user);

    @Mapping(target = "isActive", constant = "true")
    User toEntity(RegisterRequest request);
}
