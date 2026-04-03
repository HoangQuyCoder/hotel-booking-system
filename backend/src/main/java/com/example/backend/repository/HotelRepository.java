package com.example.backend.repository;

import com.example.backend.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID>, JpaSpecificationExecutor<Hotel> {
    boolean existsByNameAndCity(String name, String city);

    @Query("""
                SELECT DISTINCT h.city
                FROM Hotel h
                WHERE LOWER(h.city) LIKE LOWER(CONCAT('%', :keyword, '%'))
                ORDER BY h.city ASC
            """)
    List<String> findDistinctCitiesContainingIgnoreCase(String keyword);

    // Top rating
    List<Hotel> findTop10ByIsActiveTrueOrderByRatingDesc();

    // Newest
    List<Hotel> findTop10ByIsActiveTrueOrderByCreatedAtDesc();

    // Theo city
    List<Hotel> findTop10ByCityAndIsActiveTrueOrderByRatingDesc(String city);
}
