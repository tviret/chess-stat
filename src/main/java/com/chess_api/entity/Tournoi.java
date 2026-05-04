package com.chess_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tournoi",
       uniqueConstraints = @UniqueConstraint(columnNames = {"nom", "date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tournoi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "classement_moyen")
    private Integer classementMoyen;

    @Column(name = "nbr_joueurs")
    private Integer nbrJoueurs;

    @Column(name = "nbr_parties")
    private Integer nbrParties;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code_pays", referencedColumnName = "code")
    private Pays pays;
}
