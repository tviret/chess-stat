package com.chess_api.repository;

import com.chess_api.entity.Joueur;
import com.chess_api.entity.Participation;
import com.chess_api.entity.Tournoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoueurRepository extends JpaRepository<Joueur, Long> {

    Optional<Joueur> findByNomComplet(String nomComplet);

    @Query("""
        SELECT DISTINCT j FROM Joueur j
        LEFT JOIN Participation p ON p.joueur = j
        WHERE (:nom     IS NULL OR LOWER(j.nomComplet) LIKE LOWER(CONCAT('%', :nom, '%')))
        AND   (:pays    IS NULL OR j.pays.code = :pays)
        AND   (:tournoi IS NULL OR p.tournoi.id = :tournoi)
        AND   (:eloMin  IS NULL OR p.elo >= :eloMin)
        AND   (:eloMax  IS NULL OR p.elo <= :eloMax)
        """)
    List<Joueur> search(
        @Param("nom")     String nom,
        @Param("pays")    String pays,
        @Param("tournoi") Long   tournoi,
        @Param("eloMin")  Integer eloMin,
        @Param("eloMax")  Integer eloMax
    );

    @Query("""
    SELECT t FROM Participation p
    JOIN p.tournoi t
    WHERE p.joueur.nomComplet = :nomComplet
    ORDER BY t.date DESC
""")
    List<Tournoi> getTournoisJoueur(@Param("nomComplet") String nomComplet);
}
