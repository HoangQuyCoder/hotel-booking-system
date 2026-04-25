package com.example.backend.repository;

import com.example.backend.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, UUID> {
    Optional<EmailVerification> findTopByEmailIgnoreCaseOrderByExpiryTimeDesc(String email);
}