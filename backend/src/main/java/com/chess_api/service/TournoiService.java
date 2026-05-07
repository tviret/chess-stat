package com.chess_api.service;

import com.chess_api.dto.OuvertureStatsDto;
import com.chess_api.dto.ParticipationDto;
import com.chess_api.dto.TournoiDto;
import com.chess_api.dto.TournoiStatsDto;
import com.chess_api.entity.Participation;
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
                                nom != null && !nom.isBlank() ? nom : null,
                                pays != null && !pays.isBlank() ? pays : null,
                                debut,
                                fin).stream().map(TournoiService::toDto).toList();
        }

        public TournoiStatsDto getStats(Long idTournoi) {
                Tournoi tournoi = tournoiRepository.findById(idTournoi)
                                .orElseThrow(() -> new RuntimeException("Tournoi introuvable : " + idTournoi));

                List<Partie> parties = partieRepository.findByTournoiId(idTournoi);

                long nbVictoiresBlancs = parties.stream().filter(p -> p.getResultat() == 1).count();
                long nbVictoiresNoirs = parties.stream().filter(p -> p.getResultat() == -1).count();
                long nbNulles = parties.stream().filter(p -> p.getResultat() == 0).count();

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

        public List<ParticipationDto> getParticipations(Long idTournoi) {
                List<Participation> participations = tournoiRepository.getParticipationsTournoi(idTournoi);

                return participations.stream().map(this::participationToDto).toList();

        }

        public TournoiDto findById(Long id) {
                Tournoi tournoi = tournoiRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tournoi introuvable : " + id));
                return toDto(tournoi);
        }

        public TournoiDto save(TournoiDto dto) {
                Tournoi tournoi = Tournoi.builder()
                                .nom(dto.getNom())
                                .date(dto.getDate())
                                .classementMoyen(dto.getClassementMoyen())
                                .nbrJoueurs(dto.getNbrJoueurs())
                                .nbrParties(dto.getNbrParties())
                                .pays(dto.getPays() != null ? paysService.findEntityByCode(dto.getPays().getCode())
                                                : null)
                                .build();
                Tournoi saved = tournoiRepository.save(tournoi);
                return toDto(saved);
        }

        public TournoiDto update(Long id, TournoiDto dto) {
                Tournoi tournoi = tournoiRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tournoi introuvable : " + id));
                tournoi.setNom(dto.getNom());
                tournoi.setDate(dto.getDate());
                tournoi.setClassementMoyen(dto.getClassementMoyen());
                tournoi.setNbrJoueurs(dto.getNbrJoueurs());
                tournoi.setNbrParties(dto.getNbrParties());
                if (dto.getPays() != null) {
                        tournoi.setPays(paysService.findEntityByCode(dto.getPays().getCode()));
                }
                Tournoi updated = tournoiRepository.save(tournoi);
                return toDto(updated);
        }

        public void delete(Long id) {
                tournoiRepository.deleteById(id);
        }

        public static TournoiDto toDto(Tournoi tournoi) {
                return TournoiDto.builder()
                                .id(tournoi.getId())
                                .nom(tournoi.getNom())
                                .date(tournoi.getDate())
                                .classementMoyen(tournoi.getClassementMoyen())
                                .nbrJoueurs(tournoi.getNbrJoueurs())
                                .nbrParties(tournoi.getNbrParties())
                                .pays(tournoi.getPays() != null ? PaysService.toDto(tournoi.getPays()) : null)
                                .build();
        }

        public ParticipationDto participationToDto(Participation participation) {
                return ParticipationDto.builder()
                                .id(participation.getId())
                                .joueur(participation.getJoueur())
                                .tournoi(participation.getTournoi())
                                .elo(participation.getElo())
                                .pointsMarques(participation.getPointsMarques())
                                .build();
        }
}
