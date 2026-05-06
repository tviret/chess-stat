package com.chess_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "partie",
       uniqueConstraints = @UniqueConstraint(columnNames = {"nom_complet_blancs", "nom_complet_noirs", "id_tournoi"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Partie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nom_complet_blancs", referencedColumnName = "nom_complet")
    private Joueur joueurBlancs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nom_complet_noirs", referencedColumnName = "nom_complet")
    private Joueur joueurNoirs;

    // 1 = victoire blancs, 0 = nulle, -1 = victoire noirs
    @Column(nullable = false)
    private Short resultat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ouverture")
    private Ouverture ouverture;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tournoi")
    private Tournoi tournoi;

    @Column(name = "date_partie")
    private LocalDate datePartie;

    @Column
    private Short ronde;

    @Column(name = "numero_table")
    private Short numeroTable;
}
