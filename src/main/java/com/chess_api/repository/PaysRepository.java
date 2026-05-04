package com.chess_api.repository;

import com.chess_api.entity.Pays;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {

    Optional<Pays> findByCode(String code);

    Optional<Pays> findByNom(String nom);
}
