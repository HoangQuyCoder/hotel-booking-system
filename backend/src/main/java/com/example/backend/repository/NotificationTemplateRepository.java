package com.example.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.backend.model.NotificationTemplate;

@Repository
public interface NotificationTemplateRepository
        extends JpaRepository<NotificationTemplate, UUID>, JpaSpecificationExecutor<NotificationTemplate> {
    Optional<NotificationTemplate> findByName(String templateName);

    boolean existsByName(String name);
}