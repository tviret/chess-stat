package com.chess_api.dto;

import com.chess_api.entity.Joueur;
import com.chess_api.entity.Ouverture;
import com.chess_api.entity.Tournoi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipationDto {
    private Long id;
    private Joueur joueur;
    private Tournoi tournoi;
    private Integer elo;
    private BigDecimal pointsMarques;

}
