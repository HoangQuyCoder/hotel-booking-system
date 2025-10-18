package com.example.backend.repository;

import com.example.backend.model.RoomAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomAmenityRepository extends JpaRepository<RoomAmenity, UUID> {
    boolean existsByNameAndRoomTypeId(String name, UUID roomTypeId);

    @Query("SELECT ra FROM RoomAmenity ra WHERE ra.isActive = true " +
            "AND (:roomTypeId IS NULL OR ra.roomType.id = :roomTypeId) " +
            "AND (:category IS NULL OR ra.category = :category)")
    List<RoomAmenity> findByFilters(@Param("roomTypeId") UUID roomTypeId,
                                    @Param("category") String category);
}
