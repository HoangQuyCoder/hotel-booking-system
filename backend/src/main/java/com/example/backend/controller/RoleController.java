package com.example.backend.controller;

import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.service.RoleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final RoleService roleService;

    // CREATE A NEW ROLE
    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(
            @Valid @RequestBody RoleRequest request) {

        RoleResponse created = roleService.createRole(request);
        return ResponseEntity
                .status(201)
                .body(ApiResponse.success("Create new role successfully!", created));
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> getRole(@PathVariable @NonNull UUID id) {
        RoleResponse role = roleService.getRoleById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Get role information successfully", role));
    }

    // UPDATE ROLE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(
            @PathVariable @NonNull UUID id,
            @Valid @RequestBody @NonNull RoleRequest request) {

        RoleResponse updated = roleService.updateRole(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Role update successful", updated));
    }

    // DELETE ROLE BY ID
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable @NonNull UUID id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(
                ApiResponse.ok("User deleted successfully"));
    }

    // TAKE ALL ROLES
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAllRoles();
        return ResponseEntity.ok(
                ApiResponse.success("Get list of successful roles", roles));
    }
}