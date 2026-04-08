package com.example.backend.service;

import com.example.backend.dto.filter.NotificationLogFilterRequest;
import com.example.backend.dto.response.NotificationLogResponse;
import com.example.backend.dto.response.PagedResponse;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.NotificationLogMapper;
import com.example.backend.model.NotificationLog;
import com.example.backend.model.User;
import com.example.backend.repository.NotificationLogRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.specification.NotificationLogSpecification;
import com.example.backend.utils.PagingUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationLogService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationLogService.class);

    private final NotificationLogRepository logRepository;
    private final UserRepository userRepository;
    private final NotificationLogMapper notificationLogMapper;

    @Transactional
    public NotificationLogResponse getLogById(UUID id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        NotificationLog log = logRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("[getLogById] Log not found for ID: {}", id);
                    return new ResourceNotFoundException("Log not found");
                });

        if (auth.getAuthorities().stream().noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) &&
                !log.getUser().getEmail().equals(auth.getName())) {
            throw new SecurityException("Unauthorized access to log");
        }

        return notificationLogMapper.toResponse(log);
    }

    @Transactional
    public List<NotificationLogResponse> getLogs(UUID userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && userId != null) {
            User currentUser = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (!currentUser.getId().equals(userId)) {
                throw new SecurityException("Cannot view other user's logs");
            }
        }

        List<NotificationLog> logs = logRepository.findByUserId(isAdmin ? userId : null);
        return logs.stream().map(notificationLogMapper::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationLogResponse> getAllLogs(NotificationLogFilterRequest filterRequest) {
        logger.info("Fetching notification logs with filters: {}", filterRequest);

        Pageable pageable = PagingUtils.toPageable(filterRequest);
        Specification<NotificationLog> spec = NotificationLogSpecification.build(filterRequest);

        // Execute query
        Page<NotificationLog> pageResult = logRepository.findAll(spec, pageable);

        List<NotificationLogResponse> content = pageResult.getContent().stream()
                .map(notificationLogMapper::toResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages());
    }
}
