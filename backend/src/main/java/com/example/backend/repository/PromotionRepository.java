package com.example.backend.repository;

import com.example.backend.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, UUID>, JpaSpecificationExecutor<Promotion> {
    boolean existsByCode(String code);

    @Query("SELECT p FROM Promotion p WHERE p.isActive = true " +
            "AND (:code IS NULL OR p.code LIKE %:code%)")
    List<Promotion> findByFilters(@Param("code") String code);
}
