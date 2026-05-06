package com.chess_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoueurStatsDto {
    private String nomComplet;
    private PaysDto pays;
    private Long nbParties;
    private Long nbVictoires;
    private Long nbNulles;
    private Long nbDefaites;
    private Double tauxVictoire; // en %
    private Integer eloMoyen;
}
