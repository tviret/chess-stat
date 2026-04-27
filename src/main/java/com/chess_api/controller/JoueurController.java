package com.chess_api.controller;

import com.chess_api.dto.JoueurDto;
import com.chess_api.dto.JoueurStatsDto;
import com.chess_api.dto.OuvertureStatsDto;
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
    private final StatsService statsService;

    // GET /api/joueurs
    // GET /api/joueurs?nom=Magnus
    // GET /api/joueurs?pays=no
    @GetMapping
    public ResponseEntity<List<JoueurDto>> findAll(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String pays
    ) {
        if (nom != null)  return ResponseEntity.ok(joueurService.search(nom));
        if (pays != null) return ResponseEntity.ok(joueurService.findByPays(pays));
        return ResponseEntity.ok(joueurService.findAll());
    }

    // GET /api/joueurs/{nomComplet}/stats
    @GetMapping("/{nomComplet}/stats")
    public ResponseEntity<JoueurStatsDto> getStats(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getStats(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/ouvertures
    // GET /api/joueurs/{nomComplet}/ouvertures?detail=true  (avec taux de victoire)
    @GetMapping("/{nomComplet}/ouvertures")
    public ResponseEntity<List<OuvertureStatsDto>> getOuvertures(
            @PathVariable String nomComplet,
            @RequestParam(required = false, defaultValue = "false") boolean detail
    ) {
        if (detail) {
            return ResponseEntity.ok(statsService.getOuverturesStatsForJoueur(nomComplet));
        }
        return ResponseEntity.ok(statsService.getTopOuverturesByJoueur(nomComplet));
    }
}
