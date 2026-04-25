package com.example.backend.controller;

import com.example.backend.dto.filter.UserFilterRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.security.CustomUserDetails;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

        private final UserService userService;

        // GET USER BY ID
        @GetMapping("/{id}")
        @PreAuthorize("hasRole('CLIENT') and #id == authentication.principal.id or hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<UserResponse>> getUser(@PathVariable @NonNull UUID id) {
                UserResponse user = userService.getUserById(id);
                return ResponseEntity.ok(
                                ApiResponse.success("Get user information successfully", user));
        }

        // GET CURRENT USER
        @GetMapping("/me")
        public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
                        @AuthenticationPrincipal CustomUserDetails userDetails) {

                UserResponse user = userService.getUserById(Objects.requireNonNull(userDetails.getId()));
                return ResponseEntity.ok(
                                ApiResponse.success("Get personal information successfully", user));
        }

        // GET ALL USERS (with pagination and filter)
        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getAllUsers(
                        UserFilterRequest filterRequest) {

                PagedResponse<UserResponse> paged = userService.getAllUsers(filterRequest);
                return ResponseEntity.ok(
                                ApiResponse.success("Get list of users successfully", paged));
        }

        // UPDATE USER
        @PutMapping("/{id}")
        @PreAuthorize("hasRole('CLIENT') and #id == authentication.principal.id or hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<UserResponse>> updateUser(
                        @PathVariable @NonNull UUID id,
                        @Valid @RequestBody UserUpdateRequest request) {

                UserResponse updated = userService.updateUser(id, request);
                return ResponseEntity.ok(
                                ApiResponse.success("Information updated successfully", updated));
        }

        // DELETE USER
        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable @NonNull UUID id) {
                userService.deleteUser(id);
                return ResponseEntity.ok(
                                ApiResponse.ok("User deleted successfully"));
        }
}