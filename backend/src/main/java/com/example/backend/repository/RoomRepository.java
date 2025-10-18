package com.example.backend.repository;

import com.example.backend.model.Room;
import com.example.backend.common.RoomStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    boolean existsByRoomNumberAndRoomTypeId(String roomNumber, UUID roomTypeId);

    @Query("SELECT r FROM Room r WHERE " +
            "(:roomTypeId IS NULL OR r.roomType.id = :roomTypeId) " +
            "AND (:status IS NULL OR r.status = :status)")
    Page<Room> findByFilters(@Param("roomTypeId") UUID roomTypeId, @Param("status") RoomStatus status, Pageable pageable);
}