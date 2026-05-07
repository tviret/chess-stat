package com.chess_api.controller;

import com.chess_api.dto.*;
import com.chess_api.service.JoueurService;
import com.chess_api.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Joueurs", description = "Gestion et statistiques des joueurs")
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
    // GET /api/joueurs?tournoi=3
    // GET /api/joueurs?eloMin=2500&eloMax=2800
    // GET /api/joueurs?pays=no&tournoi=3&eloMin=2500 ← combinaisons
    @Operation(summary = "Rechercher des joueurs (filtres : nom, pays, tournoi, elo)")
    @GetMapping
    public ResponseEntity<List<JoueurDto>> findAll(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) Long tournoi,
            @RequestParam(required = false) Integer eloMin,
            @RequestParam(required = false) Integer eloMax) {
        return ResponseEntity.ok(joueurService.search(nom, pays, tournoi, eloMin, eloMax));
    }

    // GET /api/joueurs/{nomComplet}/stats
    @Operation(summary = "Statistiques d'un joueur (victoires, nulles, défaites, elo moyen)")
    @GetMapping("/{nomComplet}/stats")
    public ResponseEntity<JoueurStatsDto> getStats(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getStats(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/parties
    @Operation(summary = "Parties jouées par un joueur")
    @GetMapping("/{nomComplet}/parties")
    public ResponseEntity<List<PartieDto>> getParties(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getParties(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/tournois
    @Operation(summary = "Tournois auxquels un joueur a participé")
    @GetMapping("/{nomComplet}/tournois")
    public ResponseEntity<List<TournoiDto>> getTournois(@PathVariable String nomComplet) {
        return ResponseEntity.ok(joueurService.getTournoisJoueur(nomComplet));
    }

    // GET /api/joueurs/{nomComplet}/ouvertures?detail=true
    @Operation(summary = "Ouvertures d'un joueur (detail=true pour stats complètes)")
    @GetMapping("/{nomComplet}/ouvertures")
    public ResponseEntity<List<OuvertureStatsDto>> getOuvertures(
            @PathVariable String nomComplet,
            @RequestParam(required = false, defaultValue = "false") boolean detail) {
        if (detail)
            return ResponseEntity.ok(statsService.getOuverturesStatsForJoueur(nomComplet));
        return ResponseEntity.ok(statsService.getTopOuverturesByJoueur(nomComplet));
    }

    // GET /api/joueurs/{id}
    @Operation(summary = "Récupérer un joueur par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<JoueurDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(joueurService.findById(id));
    }

    // POST /api/joueurs
    @Operation(summary = "Créer un joueur")
    @PostMapping
    public ResponseEntity<JoueurDto> create(@RequestBody JoueurDto dto) {
        return ResponseEntity.ok(joueurService.save(dto));
    }

    // PUT /api/joueurs/{id}
    @Operation(summary = "Modifier un joueur")
    @PutMapping("/{id}")
    public ResponseEntity<JoueurDto> update(@PathVariable Long id, @RequestBody JoueurDto dto) {
        return ResponseEntity.ok(joueurService.update(id, dto));
    }

    // DELETE /api/joueurs/{id}
    @Operation(summary = "Supprimer un joueur")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        joueurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
