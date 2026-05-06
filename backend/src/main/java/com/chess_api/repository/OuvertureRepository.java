package com.chess_api.repository;

import com.chess_api.entity.Ouverture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OuvertureRepository extends JpaRepository<Ouverture, Long> {

    List<Ouverture> findByCodeEco(String codeEco);

    @Query("SELECT o FROM Ouverture o WHERE LOWER(o.libelle) LIKE LOWER(CONCAT('%', :libelle, '%'))")
    List<Ouverture> searchByLibelle(@Param("libelle") String libelle);
}
