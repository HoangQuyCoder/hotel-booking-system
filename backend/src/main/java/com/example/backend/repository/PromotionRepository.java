package com.example.backend.repository;

import com.example.backend.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, UUID>, JpaSpecificationExecutor<Promotion> {
    boolean existsByCode(String code);

    Optional<Promotion> findByCode(@Param("code") String code);
}
