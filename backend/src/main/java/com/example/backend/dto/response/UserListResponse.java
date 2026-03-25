package com.example.backend.dto.response;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserListResponse extends BaseResponse{
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
}
