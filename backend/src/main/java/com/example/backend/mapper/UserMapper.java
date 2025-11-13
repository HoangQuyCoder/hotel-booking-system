package com.example.backend.mapper;

import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper extends BaseMapper<User, UserResponse> {

    @Mapping(source = "role.roleName", target = "roleName")
    UserResponse toResponse(User user);
}

