package com.chess_api.service;

import com.chess_api.dto.OuvertureStatsDto;
import com.chess_api.repository.PartieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final PartieRepository partieRepository;

    // Top ouvertures jouées par un joueur (nb parties)
    public List<OuvertureStatsDto> getTopOuverturesByJoueur(String nomComplet) {
        return partieRepository.findTopOuverturesByJoueur(nomComplet)
                .stream()
                .map(row -> OuvertureStatsDto.builder()
                        .libelle((String) row[0])
                        .codeEco((String) row[1])
                        .nbParties((Long) row[2])
                        .build())
                .toList();
    }

    // Top ouvertures jouées par un pays
    public List<OuvertureStatsDto> getTopOuverturesByPays(String codePays) {
        return partieRepository.findTopOuverturesByPays(codePays)
                .stream()
                .map(row -> OuvertureStatsDto.builder()
                        .libelle((String) row[0])
                        .codeEco((String) row[1])
                        .nbParties((Long) row[2])
                        .build())
                .toList();
    }

    // Stats ouvertures d'un joueur avec taux de victoire
    public List<OuvertureStatsDto> getOuverturesStatsForJoueur(String nomComplet) {
        return partieRepository.findOuverturesStatsForJoueur(nomComplet)
                .stream()
                .map(row -> {
                    long nbParties   = (Long) row[2];
                    long nbVictoires = (Long) row[3];
                    long nbDefaites  = nbParties - nbVictoires;
                    double taux      = nbParties > 0 ? (double) nbVictoires / nbParties * 100 : 0;

                    return OuvertureStatsDto.builder()
                            .libelle((String) row[0])
                            .codeEco((String) row[1])
                            .nbParties(nbParties)
                            .nbVictoires(nbVictoires)
                            .nbDefaites(nbDefaites)
                            .tauxVictoire(Math.round(taux * 10.0) / 10.0)
                            .build();
                })
                .toList();
    }
}
