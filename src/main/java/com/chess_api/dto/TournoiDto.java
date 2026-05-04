package com.chess_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TournoiDto {
    private Long id;
    private String nom;
    private LocalDate date;
    private Integer classementMoyen;
    private Integer nbrJoueurs;
    private Integer nbrParties;
    private PaysDto pays;
}
