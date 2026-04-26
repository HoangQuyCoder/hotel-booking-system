package com.example.backend.service;

import com.example.backend.dto.request.RoleRequest;
import com.example.backend.dto.response.RoleResponse;
import com.example.backend.exception.BadRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.RoleMapper;
import com.example.backend.model.Role;
import com.example.backend.repository.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private static final Logger logger = LoggerFactory.getLogger(RoleService.class);

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        logger.info("Creating role with name: {}", request.getRoleName());

        if (roleRepository.existsByRoleName(request.getRoleName())) {
            logger.warn("Role name already exists: {}", request.getRoleName());
            throw new BadRequestException("Role name already exists");
        }

        Role role = roleMapper.toEntity(Objects.requireNonNull(request));

        Role saved = roleRepository.save(Objects.requireNonNull(role));
        return roleMapper.toResponse(saved);
    }

    @Transactional
    public RoleResponse getRoleById(@NonNull UUID id) {
        logger.info("Fetching role with ID: {}", id);

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] Role not found with ID: {}", id);
                    return new ResourceNotFoundException("Role not found");
                });
        return roleMapper.toResponse(role);
    }

    @Transactional
    public RoleResponse updateRole(@NonNull UUID id, @NonNull RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        if (roleRepository.existsByRoleName(request.getRoleName())
                && !role.getRoleName().equals(request.getRoleName())) {
            throw new BadRequestException("Role name already exists");
        }

        roleMapper.updateEntity(Objects.requireNonNull(request), Objects.requireNonNull(role));

        return roleMapper.toResponse(roleRepository.save(Objects.requireNonNull(role)));
    }

    @Transactional
    public void deleteRole(@NonNull UUID id) {
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

    @Transactional
    public List<RoleResponse> getAllRoles() {
        logger.info("Fetching all roles");

        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(roleMapper::toResponse)
                .collect(Collectors.toList());
    }
}
