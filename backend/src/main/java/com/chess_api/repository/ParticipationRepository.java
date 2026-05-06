package com.chess_api.repository;

import com.chess_api.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    List<Participation> findByJoueurNomComplet(String nomComplet);

    List<Participation> findByTournoiId(Long idTournoi);

    @Query("SELECT p FROM Participation p WHERE p.elo BETWEEN :eloMin AND :eloMax")
    List<Participation> findByEloRange(@Param("eloMin") int eloMin, @Param("eloMax") int eloMax);

    @Query("SELECT p FROM Participation p WHERE p.tournoi.id = :idTournoi AND p.elo BETWEEN :eloMin AND :eloMax")
    List<Participation> findByTournoiAndEloRange(
            @Param("idTournoi") Long idTournoi,
            @Param("eloMin") int eloMin,
            @Param("eloMax") int eloMax
    );
}
