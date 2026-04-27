package com.chess_api.repository;

import com.chess_api.entity.Joueur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoueurRepository extends JpaRepository<Joueur, Long> {

    Optional<Joueur> findByNomComplet(String nomComplet);

    List<Joueur> findByPaysCode(String codePays);

    @Query("SELECT j FROM Joueur j WHERE LOWER(j.nomComplet) LIKE LOWER(CONCAT('%', :nom, '%'))")
    List<Joueur> searchByNom(@Param("nom") String nom);
}
