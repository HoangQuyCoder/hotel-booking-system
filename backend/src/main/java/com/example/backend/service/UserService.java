package com.example.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.filter.UserFilterRequest;
import com.example.backend.dto.request.UserUpdateRequest;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.specification.UserSpecification;
import com.example.backend.utils.PagingUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;

    // ============================= GET USER =============================

    public UserResponse getUserById(UUID id) {
        logger.debug("Fetching user by ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[get] User not found for ID: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        logger.info("User retrieved successfully: {}", user.getEmail());
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(UserFilterRequest filterRequest) {
        logger.info("Fetching users with filters: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);
        Specification<User> spec = UserSpecification.build(filterRequest);

        // Execute query
        Page<User> pageResult = userRepository.findAll(spec, pageable);
        logger.info("Found {} users (page {}/{})", pageResult.getNumberOfElements(), pageResult.getNumber() + 1,
                pageResult.getTotalPages());

        List<UserResponse> content = pageResult.getContent().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());

        // Optional detailed logging (DEBUG)
        if (logger.isDebugEnabled()) {
            content.forEach(
                    u -> logger.debug("User: id={}, email={}, role={}", u.getId(), u.getEmail(), u.getRoleName()));
        }

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages());
    }

    // ============================= UPDATE =============================

    @Transactional
    public UserResponse updateUser(UUID id, @Valid UserUpdateRequest request) {
        logger.info("Updating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[update] User not found for ID: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        // Check email if sent
        if (request.getEmail() != null && !user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                logger.warn("[update] Email already exists: {}", request.getEmail());
                throw new IllegalArgumentException("Email already exists");
            }
            user.setEmail(request.getEmail());
            logger.debug("Updated email for user {} to {}", user.getId(), request.getEmail());
        }

        // Update a role (only admin can change a role)
        String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities().toString();
        if (request.getRoleName() != null && !user.getRole().getRoleName().equals(request.getRoleName())
                && currentRole.contains("ROLE_ADMIN")) {
            Role role = roleRepository.findByRoleName(request.getRoleName())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRole(role);
            logger.debug("Updated role for user {} to {}", user.getId(), role.getRoleName());
        }

        userMapper.updateEntity(request, user);

        try {
            User updated = userRepository.save(user);
            logger.info("User updated successfully: {}", user.getEmail());
            return userMapper.toResponse(updated);
        } catch (Exception e) {
            logger.error("Failed to update user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to update user by id");
        }
    }

    // ============================= DELETE =============================

    @Transactional
    public void deleteUser(UUID id) {
        logger.warn("Deactivating user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[delete] User not found for ID: {}", id);
                    return new ResourceNotFoundException("User not found");
                });

        user.setIsActive(false);

        try {
            userRepository.save(user);
            logger.info("User deactivated successfully: {}", user.getEmail());
        } catch (Exception e) {
            logger.error("Failed to deactivate user {}: {}", user.getEmail(), e.getMessage(), e);
            throw new ResourceNotFoundException("Failed to delete user by id");
        }
    }
}
