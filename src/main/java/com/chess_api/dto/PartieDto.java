package com.chess_api.dto;
import com.chess_api.entity.Joueur;
import com.chess_api.entity.Ouverture;
import com.chess_api.entity.Tournoi;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartieDto {
    private Long id;
    private Joueur joueurBlancs;
    private Joueur joueurNoirs;
    private Short resultat;
    private Ouverture ouverture;
    private Tournoi tournoi;
    private LocalDate datePartie;
    private Short ronde;
    private Short numeroTable;

}
