package com.chess_api.repository;

import com.chess_api.entity.Partie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PartieRepository extends JpaRepository<Partie, Long> {

    // --- Par tournoi ---
    List<Partie> findByTournoiId(Long idTournoi);

    // --- Par joueur ---
    List<Partie> findByJoueurBlancsNomComplet(String nomComplet);
    List<Partie> findByJoueurNoirsNomComplet(String nomComplet);

    @Query("""
        SELECT p FROM Partie p
        WHERE p.joueurBlancs.nomComplet = :nom OR p.joueurNoirs.nomComplet = :nom
    """)
    List<Partie> findByJoueur(@Param("nom") String nomComplet);

    // --- Par date ---
    List<Partie> findByDatePartieBetween(LocalDate debut, LocalDate fin);

    // --- Stats : ouvertures les plus jouées dans un tournoi ---
    @Query("""
        SELECT p.ouverture.libelle, p.ouverture.codeEco, COUNT(p) as nb
        FROM Partie p
        WHERE p.tournoi.id = :idTournoi AND p.ouverture IS NOT NULL
        GROUP BY p.ouverture.id, p.ouverture.libelle, p.ouverture.codeEco
        ORDER BY nb DESC
    """)
    List<Object[]> findTopOuverturesByTournoi(@Param("idTournoi") Long idTournoi);

    // --- Stats : ouvertures les plus jouées par un joueur ---
    @Query("""
        SELECT p.ouverture.libelle, p.ouverture.codeEco, COUNT(p) as nb
        FROM Partie p
        WHERE (p.joueurBlancs.nomComplet = :nom OR p.joueurNoirs.nomComplet = :nom)
        AND p.ouverture IS NOT NULL
        GROUP BY p.ouverture.id, p.ouverture.libelle, p.ouverture.codeEco
        ORDER BY nb DESC
    """)
    List<Object[]> findTopOuverturesByJoueur(@Param("nom") String nomComplet);

    // --- Stats : ouvertures les plus jouées par un pays ---
    @Query("""
        SELECT p.ouverture.libelle, p.ouverture.codeEco, COUNT(p) as nb
        FROM Partie p
        WHERE (p.joueurBlancs.pays.code = :codePays OR p.joueurNoirs.pays.code = :codePays)
        AND p.ouverture IS NOT NULL
        GROUP BY p.ouverture.id, p.ouverture.libelle, p.ouverture.codeEco
        ORDER BY nb DESC
    """)
    List<Object[]> findTopOuverturesByPays(@Param("codePays") String codePays);

    // --- Stats : taux de victoire d'un joueur par ouverture ---
    @Query("""
        SELECT p.ouverture.libelle, p.ouverture.codeEco,
               COUNT(p) as nb,
               SUM(CASE WHEN (p.joueurBlancs.nomComplet = :nom AND p.resultat = 1)
                          OR (p.joueurNoirs.nomComplet = :nom AND p.resultat = -1)
                        THEN 1 ELSE 0 END) as victoires
        FROM Partie p
        WHERE (p.joueurBlancs.nomComplet = :nom OR p.joueurNoirs.nomComplet = :nom)
        AND p.ouverture IS NOT NULL
        GROUP BY p.ouverture.id, p.ouverture.libelle, p.ouverture.codeEco
        ORDER BY nb DESC
    """)
    List<Object[]> findOuverturesStatsForJoueur(@Param("nom") String nomComplet);

    // --- Filtre combiné : joueur + plage de dates ---
    @Query("""
        SELECT p FROM Partie p
        WHERE (p.joueurBlancs.nomComplet = :nom OR p.joueurNoirs.nomComplet = :nom)
        AND p.datePartie BETWEEN :debut AND :fin
    """)
    List<Partie> findByJoueurAndDateRange(
            @Param("nom") String nomComplet,
            @Param("debut") LocalDate debut,
            @Param("fin") LocalDate fin
    );
}
