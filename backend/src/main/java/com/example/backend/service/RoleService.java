package com.example.backend.service;

import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Role;
import com.example.backend.repository.RoleRepository;
import com.example.backend.utils.BeanUtilsHelper;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    private static final Logger logger = LoggerFactory.getLogger(RoleService.class);

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        logger.info("Creating role with name: {}", request.getRoleName());

        if (roleRepository.existsByRoleName(request.getRoleName())) {
            logger.error("[create] Role name already exists: {}", request.getRoleName());
            throw new IllegalArgumentException("Role name already exists");
        }

        Role role = Role.builder()
                .roleName(request.getRoleName())
                .description(request.getDescription())
                .build();

        try {
            Role saved = roleRepository.save(role);
            logger.info("Role created successfully with ID: {}", saved.getId());
            return mapToResponse(saved);
        } catch (Exception e) {
            logger.error("Failed to create role: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create role", e);
        }
    }

    public RoleResponse getRoleById(Long id) {
        logger.info("Fetching role with ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Role not found with ID: {}", id);
                    return new ResourceNotFoundException("Role not found");
                });
        return mapToResponse(role);
    }

    @Transactional
    public RoleResponse updateRole(Long id, RoleRequest request) {
        logger.info("Updating role with ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] Role not found with ID: {}", id);
                    return new ResourceNotFoundException("Role not found");
                });

        if (roleRepository.existsByRoleName(request.getRoleName())) {
            logger.error("[update] Role name already exists: {}", request.getRoleName());
            throw new IllegalArgumentException("Role name already exists");
        }

        // Update fields only when data is available
        BeanUtilsHelper.copyNonNullProperties(request, role);

        try {
            Role updated = roleRepository.save(role);
            logger.info("Role updated successfully with ID: {}", id);
            return mapToResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update role: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update role", e);
        }
    }

    @Transactional
    public void deleteRole(Long id) {
        logger.info("Deactivating role with ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] Role not found with ID: {}", id);
                    return new ResourceNotFoundException("Role not found");
                });

        role.setIsActive(false);

        try {
            roleRepository.save(role);
            logger.info("Role deactivated successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Failed deactivate role {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete role", e);
        }
    }

    public List<RoleResponse> getAllRoles() {
        logger.info("Fetching all roles");

        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RoleResponse mapToResponse(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setRoleName(role.getRoleName());
        response.setDescription(role.getDescription());
        response.setCreatedAt(role.getCreatedAt());
        response.setUpdatedAt(role.getUpdatedAt());
        return response;
    }
}
