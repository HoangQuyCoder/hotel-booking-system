package com.example.backend.dto.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserFilterRequest extends BaseFilterRequest {
    private String username;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private UUID roleId;
    private String status;
    private String keyword;
}
