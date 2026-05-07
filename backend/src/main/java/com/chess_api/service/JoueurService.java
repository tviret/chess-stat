package com.chess_api.service;

import com.chess_api.dto.JoueurDto;
import com.chess_api.dto.JoueurStatsDto;
import com.chess_api.dto.PartieDto;
import com.chess_api.dto.TournoiDto;
import com.chess_api.entity.Joueur;
import com.chess_api.entity.Participation;
import com.chess_api.entity.Partie;
import com.chess_api.entity.Tournoi;
import com.chess_api.repository.JoueurRepository;
import com.chess_api.repository.ParticipationRepository;
import com.chess_api.repository.PartieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JoueurService {

    private final JoueurRepository joueurRepository;
    private final PartieRepository partieRepository;
    private final ParticipationRepository participationRepository;
    private final PaysService paysService;

    public List<JoueurDto> search(String nom, String pays, Long tournoi, Integer eloMin, Integer eloMax) {
        return joueurRepository.search(
                nom != null && !nom.isBlank() ? nom : null,
                pays != null && !pays.isBlank() ? pays : null,
                tournoi,
                eloMin,
                eloMax).stream().map(this::toDto).toList();
    }

    public JoueurStatsDto getStats(String nomComplet) {
        Joueur joueur = joueurRepository.findByNomComplet(nomComplet)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable : " + nomComplet));

        List<Partie> parties = partieRepository.findByJoueur(nomComplet);

        long nbParties = parties.size();
        long nbVictoires = parties.stream()
                .filter(p -> (p.getJoueurBlancs().getNomComplet().equals(nomComplet) && p.getResultat() == 1) ||
                        (p.getJoueurNoirs().getNomComplet().equals(nomComplet) && p.getResultat() == -1))
                .count();
        long nbNulles = parties.stream().filter(p -> p.getResultat() == 0).count();
        long nbDefaites = nbParties - nbVictoires - nbNulles;

        double tauxVictoire = nbParties > 0 ? (double) nbVictoires / nbParties * 100 : 0;

        int eloMoyen = (int) participationRepository.findByJoueurNomComplet(nomComplet)
                .stream()
                .filter(p -> p.getElo() != null)
                .mapToInt(p -> p.getElo())
                .average()
                .orElse(0);

        return JoueurStatsDto.builder()
                .nomComplet(joueur.getNomComplet())
                .pays(joueur.getPays() != null ? paysService.toDto(joueur.getPays()) : null)
                .nbParties(nbParties)
                .nbVictoires(nbVictoires)
                .nbNulles(nbNulles)
                .nbDefaites(nbDefaites)
                .tauxVictoire(Math.round(tauxVictoire * 10.0) / 10.0)
                .eloMoyen(eloMoyen)
                .build();
    }

    public List<PartieDto> getParties(String nomComplet) {
        Joueur joueur = joueurRepository.findByNomComplet(nomComplet)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable : " + nomComplet));

        List<Partie> parties = partieRepository.findByJoueur(nomComplet);

        return parties.stream().map(this::partieToDto).toList();
    }

    public List<TournoiDto> getTournoisJoueur(String nomComplet) {
        Joueur joueur = joueurRepository.findByNomComplet(nomComplet)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable : " + nomComplet));

        List<Tournoi> tournois = joueurRepository.getTournoisJoueur(nomComplet);

        return tournois.stream().map(tournoi -> TournoiService.toDto(tournoi)).toList();

    }

    public JoueurDto findById(Long id) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable : " + id));
        return toDto(joueur);
    }

    public JoueurDto save(JoueurDto dto) {
        Joueur joueur = Joueur.builder()
                .nomComplet(dto.getNomComplet())
                .pays(dto.getPays() != null ? paysService.findEntityByCode(dto.getPays().getCode()) : null)
                .build();
        Joueur saved = joueurRepository.save(joueur);
        return toDto(saved);
    }

    public JoueurDto update(Long id, JoueurDto dto) {
        Joueur joueur = joueurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Joueur introuvable : " + id));
        joueur.setNomComplet(dto.getNomComplet());
        if (dto.getPays() != null) {
            joueur.setPays(paysService.findEntityByCode(dto.getPays().getCode()));
        }
        Joueur updated = joueurRepository.save(joueur);
        return toDto(updated);
    }

    public void delete(Long id) {
        joueurRepository.deleteById(id);
    }

    public JoueurDto toDto(Joueur joueur) {
        return JoueurDto.builder()
                .id(joueur.getId())
                .nomComplet(joueur.getNomComplet())
                .pays(joueur.getPays() != null ? paysService.toDto(joueur.getPays()) : null)
                .build();
    }

    public PartieDto partieToDto(Partie partie) {
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
