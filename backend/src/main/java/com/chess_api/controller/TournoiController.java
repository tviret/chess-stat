package com.chess_api.controller;

import com.chess_api.dto.ParticipationDto;
import com.chess_api.dto.TournoiDto;
import com.chess_api.dto.TournoiStatsDto;
import com.chess_api.service.TournoiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Tournois", description = "Gestion et statistiques des tournois")
@RestController
@RequestMapping("/api/tournois")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TournoiController {

    private final TournoiService tournoiService;

    // GET /api/tournois
    // GET /api/tournois?nom=Open
    // GET /api/tournois?pays=fr
    // GET /api/tournois?debut=2024-01-01&fin=2024-12-31
    // GET /api/tournois?pays=fr&debut=2024-01-01 ← combinaisons
    @Operation(summary = "Rechercher des tournois (filtres : nom, pays, dates)")
    @GetMapping
    public ResponseEntity<List<TournoiDto>> findAll(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(tournoiService.search(nom, pays, debut, fin));
    }

    // GET /api/tournois/{id}/stats
    @Operation(summary = "Statistiques d'un tournoi (résultats, ouvertures populaires)")
    @GetMapping("/{id}/stats")
    public ResponseEntity<TournoiStatsDto> getStats(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.getStats(id));
    }

    // GET /api/tournois/{id}/stats
    @Operation(summary = "Participations d'un tournoi")
    @GetMapping("/{id}/participations")
    public ResponseEntity<List<ParticipationDto>> getParticipations(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.getParticipations(id));
    }

    // GET /api/tournois/{id}
    @Operation(summary = "Récupérer un tournoi par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<TournoiDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.findById(id));
    }

    // POST /api/tournois
    @Operation(summary = "Créer un tournoi")
    @PostMapping
    public ResponseEntity<TournoiDto> create(@RequestBody TournoiDto dto) {
        return ResponseEntity.ok(tournoiService.save(dto));
    }

    // PUT /api/tournois/{id}
    @Operation(summary = "Modifier un tournoi")
    @PutMapping("/{id}")
    public ResponseEntity<TournoiDto> update(@PathVariable Long id, @RequestBody TournoiDto dto) {
        return ResponseEntity.ok(tournoiService.update(id, dto));
    }

    // DELETE /api/tournois/{id}
    @Operation(summary = "Supprimer un tournoi")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tournoiService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
