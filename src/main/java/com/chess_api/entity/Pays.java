package com.chess_api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pays")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pays {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nom;

    @Column(nullable = false, unique = true, length = 2)
    private String code;
}
