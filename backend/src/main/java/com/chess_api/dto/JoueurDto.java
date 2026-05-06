package com.chess_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoueurDto {
    private Long id;
    private String nomComplet;
    private PaysDto pays;
}
