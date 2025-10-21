package com.example.backend.repository;

import com.example.backend.model.DailyOverride;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyOverrideRepository extends JpaRepository<DailyOverride, UUID> {
    @Query("SELECT do FROM DailyOverride do WHERE do.isActive = true " +
            "AND (:roomTypeId IS NULL OR do.roomType.id = :roomTypeId) " +
            "AND (:date IS NULL OR do.date = :date)")
    Page<DailyOverride> findByFilters(@Param("roomTypeId") UUID roomTypeId, @Param("date") LocalDate date, Pageable pageable);

    boolean existsByRoomTypeIdAndDate(UUID roomTypeId, LocalDate date);

    Optional<DailyOverride> findByRoomTypeIdAndDate(UUID roomTypeId, LocalDate date);
}
