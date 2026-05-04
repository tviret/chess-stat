package com.chess_api.service;

import com.chess_api.dto.OuvertureStatsDto;
import com.chess_api.dto.TournoiDto;
import com.chess_api.dto.TournoiStatsDto;
import com.chess_api.entity.Partie;
import com.chess_api.entity.Tournoi;
import com.chess_api.repository.PartieRepository;
import com.chess_api.repository.TournoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TournoiService {

    private final TournoiRepository tournoiRepository;
    private final PartieRepository partieRepository;
    private final PaysService paysService;

    public List<TournoiDto> search(String nom, String pays, LocalDate debut, LocalDate fin) {
        return tournoiRepository.search(
                nom  != null && !nom.isBlank()  ? nom  : null,
                pays != null && !pays.isBlank() ? pays : null,
                debut,
                fin
        ).stream().map(this::toDto).toList();
    }

    public TournoiStatsDto getStats(Long idTournoi) {
        Tournoi tournoi = tournoiRepository.findById(idTournoi)
                .orElseThrow(() -> new RuntimeException("Tournoi introuvable : " + idTournoi));

        List<Partie> parties = partieRepository.findByTournoiId(idTournoi);

        long nbVictoiresBlancs = parties.stream().filter(p -> p.getResultat() == 1).count();
        long nbVictoiresNoirs  = parties.stream().filter(p -> p.getResultat() == -1).count();
        long nbNulles          = parties.stream().filter(p -> p.getResultat() == 0).count();

        // Top ouvertures
        List<OuvertureStatsDto> topOuvertures = partieRepository
                .findTopOuverturesByTournoi(idTournoi)
                .stream()
                .map(row -> OuvertureStatsDto.builder()
                        .libelle((String) row[0])
                        .codeEco((String) row[1])
                        .nbParties((Long) row[2])
                        .build())
                .toList();

        return TournoiStatsDto.builder()
                .id(tournoi.getId())
                .nom(tournoi.getNom())
                .date(tournoi.getDate())
                .pays(tournoi.getPays() != null ? paysService.toDto(tournoi.getPays()) : null)
                .nbrJoueurs(tournoi.getNbrJoueurs())
                .nbrParties(tournoi.getNbrParties())
                .classementMoyen(tournoi.getClassementMoyen())
                .nbVictoiresBlancs(nbVictoiresBlancs)
                .nbVictoiresNoirs(nbVictoiresNoirs)
                .nbNulles(nbNulles)
                .topOuvertures(topOuvertures)
                .build();
    }

    public TournoiDto toDto(Tournoi tournoi) {
        return TournoiDto.builder()
                .id(tournoi.getId())
                .nom(tournoi.getNom())
                .date(tournoi.getDate())
                .classementMoyen(tournoi.getClassementMoyen())
                .nbrJoueurs(tournoi.getNbrJoueurs())
                .nbrParties(tournoi.getNbrParties())
                .pays(tournoi.getPays() != null ? paysService.toDto(tournoi.getPays()) : null)
                .build();
    }
}
