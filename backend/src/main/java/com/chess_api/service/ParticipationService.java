package com.chess_api.service;

import com.chess_api.dto.ParticipationDto;
import com.chess_api.entity.Joueur;
import com.chess_api.entity.Participation;
import com.chess_api.entity.Tournoi;
import com.chess_api.repository.JoueurRepository;
import com.chess_api.repository.ParticipationRepository;
import com.chess_api.repository.TournoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final JoueurRepository joueurRepository;
    private final TournoiRepository tournoiRepository;
    private final PaysService paysService;

    public List<ParticipationDto> findAll() {
        return participationRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public ParticipationDto findById(Long id) {
        Participation participation = participationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participation introuvable : " + id));
        return toDto(participation);
    }

    public ParticipationDto save(ParticipationDto dto) {
        Participation participation = Participation.builder()
                .joueur(resolveJoueur(dto.getJoueur()))
                .tournoi(resolveTournoi(dto.getTournoi()))
                .elo(dto.getElo())
                .pointsMarques(dto.getPointsMarques())
                .build();
        Participation saved = participationRepository.save(participation);
        return toDto(saved);
    }

    public ParticipationDto update(Long id, ParticipationDto dto) {
        Participation participation = participationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participation introuvable : " + id));
        participation.setJoueur(resolveJoueur(dto.getJoueur()));
        participation.setTournoi(resolveTournoi(dto.getTournoi()));
        participation.setElo(dto.getElo());
        participation.setPointsMarques(dto.getPointsMarques());
        Participation updated = participationRepository.save(participation);
        return toDto(updated);
    }

    private Joueur resolveJoueur(Joueur joueur) {
        if (joueur == null || joueur.getNomComplet() == null || joueur.getNomComplet().isBlank()) {
            throw new RuntimeException("Joueur invalide pour la participation.");
        }
        return joueurRepository.findByNomComplet(joueur.getNomComplet())
                .orElseThrow(() -> new RuntimeException("Joueur introuvable : " + joueur.getNomComplet()));
    }

    private Tournoi resolveTournoi(Tournoi tournoi) {
        if (tournoi == null || tournoi.getId() == null) {
            throw new RuntimeException("Tournoi invalide pour la participation.");
        }
        return tournoiRepository.findById(tournoi.getId())
                .orElseThrow(() -> new RuntimeException("Tournoi introuvable : " + tournoi.getId()));
    }

    public void delete(Long id) {
        participationRepository.deleteById(id);
    }

    public ParticipationDto toDto(Participation participation) {
        return ParticipationDto.builder()
                .id(participation.getId())
                .joueur(participation.getJoueur())
                .tournoi(participation.getTournoi())
                .elo(participation.getElo())
                .pointsMarques(participation.getPointsMarques())
                .build();
    }

    @Transactional
    public ParticipationDto createParticipationWithPlayerIfNeeded(
            String joueurNomComplet, String joueurPaysCode,
            Long tournoiId, Integer elo, BigDecimal pointsMarques) {

        // Résoudre ou créer le joueur
        Joueur joueur = joueurRepository.findByNomComplet(joueurNomComplet)
                .orElseGet(() -> {
                    // Créer le joueur s'il n'existe pas
                    Joueur newJoueur = Joueur.builder()
                            .nomComplet(joueurNomComplet)
                            .pays(joueurPaysCode != null ? paysService.findEntityByCode(joueurPaysCode) : null)
                            .build();
                    return joueurRepository.save(newJoueur);
                });

        // Résoudre le tournoi
        Tournoi tournoi = tournoiRepository.findById(tournoiId)
                .orElseThrow(() -> new RuntimeException("Tournoi introuvable : " + tournoiId));

        // Créer la participation
        Participation participation = Participation.builder()
                .joueur(joueur)
                .tournoi(tournoi)
                .elo(elo)
                .pointsMarques(pointsMarques)
                .build();

        Participation saved = participationRepository.save(participation);
        return toDto(saved);
    }
}