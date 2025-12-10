package com.example.backend.repository;

import com.example.backend.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID>, JpaSpecificationExecutor<NotificationLog> {
    @Query("SELECT l FROM NotificationLog l WHERE l.isActive = true " +
            "AND (:userId IS NULL OR l.user.id = :userId)")
    List<NotificationLog> findByUserId(@Param("userId") UUID userId);
}
