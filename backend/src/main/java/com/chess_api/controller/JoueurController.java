package com.chess_api.controller;

import com.chess_api.dto.*;
import com.chess_api.service.JoueurService;
import com.chess_api.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/joueurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JoueurController {

    private final JoueurService joueurService;
    private final StatsService  statsService;

    // GET /api/joueurs
    // GET /api/joueurs?nom=Magnus
    // GET /api/joueurs?pays=no
    // GET /api/joueurs?tournoi=3
    // GET /api/joueurs?eloMin=2500&eloMax=2800
    // GET /api/joueurs?pays=no&tournoi=3&eloMin=2500   ← combinaisons
    @GetMapping
    public ResponseEntity<List<JoueurDto>> findAll(
            @RequestParam(required = false) String  nom,
            @RequestParam(required = false) String  pays,
            @RequestParam(required = false) Long    tournoi,
            @RequestParam(required = false) Integer eloMin,
            @RequestParam(required = false) Integer eloMax
    ) {
        return ResponseEntity.ok(joueurService.search(nom, pays, tournoi, eloMin, eloMax));
    }

    // GET /api/joueurs/{nomComplet}/stats
    @GetMapping("/{nomComplet}/stats")
    public ResponseEntity<JoueurStatsDto> getStats(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getStats(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/parties
    @GetMapping("/{nomComplet}/parties")
    public ResponseEntity<List<PartieDto>> getParties(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getParties(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/tournois
    @GetMapping("/{nomComplet}/tournois")
    public ResponseEntity<List<TournoiDto>> getTournois(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getTournoisJoueur(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/ouvertures?detail=true
    @GetMapping("/{nomComplet}/ouvertures")
    public ResponseEntity<List<OuvertureStatsDto>> getOuvertures(
            @PathVariable String nomComplet,
            @RequestParam(required = false, defaultValue = "false") boolean detail
    ) {
        if (detail) return ResponseEntity.ok(statsService.getOuverturesStatsForJoueur(nomComplet));
        return ResponseEntity.ok(statsService.getTopOuverturesByJoueur(nomComplet));
    }
}
