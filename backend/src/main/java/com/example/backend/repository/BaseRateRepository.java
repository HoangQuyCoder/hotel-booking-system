package com.example.backend.repository;

import com.example.backend.model.BaseRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BaseRateRepository extends JpaRepository<BaseRate, UUID> , JpaSpecificationExecutor<BaseRate> {
    @Query("SELECT COUNT(br) > 0 FROM BaseRate br WHERE br.roomType.id = :roomTypeId " +
            "AND br.isActive = true " +
            "AND (br.startDate <= :endDate AND br.endDate >= :startDate)")
    boolean existsByRoomTypeIdAndOverlappingDates(@Param("roomTypeId") UUID roomTypeId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);
}
