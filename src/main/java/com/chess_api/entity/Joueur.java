package com.chess_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "joueur")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Joueur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom_complet", nullable = false, unique = true, length = 200)
    private String nomComplet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "code_pays", referencedColumnName = "code")
    private Pays pays;
}
