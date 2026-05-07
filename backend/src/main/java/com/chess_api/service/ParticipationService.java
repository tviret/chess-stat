package com.chess_api.service;

import com.chess_api.dto.ParticipationDto;
import com.chess_api.entity.Participation;
import com.chess_api.repository.JoueurRepository;
import com.chess_api.repository.ParticipationRepository;
import com.chess_api.repository.TournoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final JoueurRepository joueurRepository;
    private final TournoiRepository tournoiRepository;

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
                .joueur(dto.getJoueur())
                .tournoi(dto.getTournoi())
                .elo(dto.getElo())
                .pointsMarques(dto.getPointsMarques())
                .build();
        Participation saved = participationRepository.save(participation);
        return toDto(saved);
    }

    public ParticipationDto update(Long id, ParticipationDto dto) {
        Participation participation = participationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Participation introuvable : " + id));
        participation.setJoueur(dto.getJoueur());
        participation.setTournoi(dto.getTournoi());
        participation.setElo(dto.getElo());
        participation.setPointsMarques(dto.getPointsMarques());
        Participation updated = participationRepository.save(participation);
        return toDto(updated);
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
}