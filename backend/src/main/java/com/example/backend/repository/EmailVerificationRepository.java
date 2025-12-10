package com.example.backend.repository;

import com.example.backend.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, UUID> {
    @Query("SELECT v FROM EmailVerification v WHERE v.email = :email ORDER BY v.expiryTime DESC")
    Optional<EmailVerification> findTopByEmailOrderByExpiryTimeDesc(String email);
}