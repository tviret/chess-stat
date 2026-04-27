package com.chess_api.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FiltreStatsDto {
    private String nomJoueur;
    private String codePays;
    private Long idTournoi;
    private String codeEco;
    private Integer eloMin;
    private Integer eloMax;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    // 1 = blancs gagnent, 0 = nulle, -1 = noirs gagnent
    private Short resultat;
}
