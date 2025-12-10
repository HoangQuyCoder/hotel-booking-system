package com.example.backend.repository;

import com.example.backend.model.DailyOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyOverrideRepository extends JpaRepository<DailyOverride, UUID>, JpaSpecificationExecutor<DailyOverride> {
    boolean existsByRoomTypeIdAndDate(UUID roomTypeId, LocalDate date);

    Optional<DailyOverride> findByRoomTypeIdAndDate(UUID roomTypeId, LocalDate date);
}
