package com.example.backend.controller;

import com.example.backend.dto.filter.UserFilterRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') and #id == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserById(userDetails.getId()));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<UserResponse>> getAllUsers(UserFilterRequest filterRequest) {
        return ResponseEntity.ok(userService.getAllUsers(filterRequest));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') and #id == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
