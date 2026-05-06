package com.chess_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ouverture",
       uniqueConstraints = @UniqueConstraint(columnNames = {"code_eco", "libelle"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ouverture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_eco", nullable = false, length = 4)
    private String codeEco;

    @Column(nullable = false, length = 200)
    private String libelle;
}
