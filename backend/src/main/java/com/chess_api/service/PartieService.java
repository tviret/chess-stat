package com.chess_api.service;

import com.chess_api.dto.PartieDto;
import com.chess_api.entity.Partie;
import com.chess_api.repository.JoueurRepository;
import com.chess_api.repository.OuvertureRepository;
import com.chess_api.repository.PartieRepository;
import com.chess_api.repository.TournoiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PartieService {

    private final PartieRepository partieRepository;
    private final JoueurRepository joueurRepository;
    private final OuvertureRepository ouvertureRepository;
    private final TournoiRepository tournoiRepository;

    public List<PartieDto> findAll() {
        return partieRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public PartieDto findById(Long id) {
        Partie partie = partieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partie introuvable : " + id));
        return toDto(partie);
    }

    public PartieDto save(PartieDto dto) {
        Partie partie = Partie.builder()
                .joueurBlancs(dto.getJoueurBlancs())
                .joueurNoirs(dto.getJoueurNoirs())
                .resultat(dto.getResultat())
                .ouverture(dto.getOuverture())
                .tournoi(dto.getTournoi())
                .datePartie(dto.getDatePartie())
                .ronde(dto.getRonde())
                .numeroTable(dto.getNumeroTable())
                .build();
        Partie saved = partieRepository.save(partie);
        return toDto(saved);
    }

    public PartieDto update(Long id, PartieDto dto) {
        Partie partie = partieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partie introuvable : " + id));
        partie.setJoueurBlancs(dto.getJoueurBlancs());
        partie.setJoueurNoirs(dto.getJoueurNoirs());
        partie.setResultat(dto.getResultat());
        partie.setOuverture(dto.getOuverture());
        partie.setTournoi(dto.getTournoi());
        partie.setDatePartie(dto.getDatePartie());
        partie.setRonde(dto.getRonde());
        partie.setNumeroTable(dto.getNumeroTable());
        Partie updated = partieRepository.save(partie);
        return toDto(updated);
    }

    public void delete(Long id) {
        partieRepository.deleteById(id);
    }

    public PartieDto toDto(Partie partie) {
        return PartieDto.builder()
                .id(partie.getId())
                .joueurBlancs(partie.getJoueurBlancs())
                .joueurNoirs(partie.getJoueurNoirs())
                .resultat(partie.getResultat())
                .ouverture(partie.getOuverture())
                .tournoi(partie.getTournoi())
                .datePartie(partie.getDatePartie())
                .ronde(partie.getRonde())
                .numeroTable(partie.getNumeroTable())
                .build();
    }
}