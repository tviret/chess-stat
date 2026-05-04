package com.chess_api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "participation",
       uniqueConstraints = @UniqueConstraint(columnNames = {"nom_complet", "id_tournoi"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nom_complet", referencedColumnName = "nom_complet")
    private Joueur joueur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tournoi")
    private Tournoi tournoi;

    @Column
    private Integer elo;

    @Column(name = "points_marques", precision = 5, scale = 1)
    private BigDecimal pointsMarques;
}
