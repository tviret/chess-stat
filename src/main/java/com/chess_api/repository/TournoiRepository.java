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

    List<Tournoi> findByPaysCode(String codePays);

    List<Tournoi> findByDateBetween(LocalDate debut, LocalDate fin);

    @Query("SELECT t FROM Tournoi t WHERE LOWER(t.nom) LIKE LOWER(CONCAT('%', :nom, '%'))")
    List<Tournoi> searchByNom(@Param("nom") String nom);
}
