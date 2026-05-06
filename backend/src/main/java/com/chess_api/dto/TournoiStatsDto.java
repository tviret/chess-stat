package com.chess_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TournoiStatsDto {
    private Long id;
    private String nom;
    private LocalDate date;
    private PaysDto pays;
    private Integer nbrJoueurs;
    private Integer nbrParties;
    private Integer classementMoyen;
    private Long nbVictoiresBlancs;
    private Long nbVictoiresNoirs;
    private Long nbNulles;
    private List<OuvertureStatsDto> topOuvertures;
}
