package com.chess_api.repository;

import com.chess_api.entity.Tournoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TournoiRepository extends JpaRepository<Tournoi, Long> {

    @Query("""
        SELECT t FROM Tournoi t
        WHERE (:nom   IS NULL OR LOWER(t.nom) LIKE LOWER(CONCAT('%', :nom, '%')))
        AND   (:pays  IS NULL OR t.pays.code = :pays)
        AND   (:debut IS NULL OR t.date >= :debut)
        AND   (:fin   IS NULL OR t.date <= :fin)
        """)
    List<Tournoi> search(
        @Param("nom")   String    nom,
        @Param("pays")  String    pays,
        @Param("debut") LocalDate debut,
        @Param("fin")   LocalDate fin
    );
}
