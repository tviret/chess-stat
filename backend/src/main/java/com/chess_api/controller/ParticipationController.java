package com.chess_api.controller;

import com.chess_api.dto.ParticipationDto;
import com.chess_api.service.ParticipationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Participations", description = "Gestion des participations aux tournois")
@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParticipationController {

    private final ParticipationService participationService;

    // GET /api/participations
    @Operation(summary = "Lister toutes les participations")
    @GetMapping
    public ResponseEntity<List<ParticipationDto>> findAll() {
        return ResponseEntity.ok(participationService.findAll());
    }

    // GET /api/participations/{id}
    @Operation(summary = "Récupérer une participation par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<ParticipationDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(participationService.findById(id));
    }

    // POST /api/participations
    @Operation(summary = "Créer une participation (joueur et tournoi doivent exister)")
    @PostMapping
    public ResponseEntity<ParticipationDto> create(@RequestBody ParticipationDto dto) {
        return ResponseEntity.ok(participationService.save(dto));
    }

    // PUT /api/participations/{id}
    @Operation(summary = "Modifier une participation")
    @PutMapping("/{id}")
    public ResponseEntity<ParticipationDto> update(@PathVariable Long id, @RequestBody ParticipationDto dto) {
        return ResponseEntity.ok(participationService.update(id, dto));
    }

    // DELETE /api/participations/{id}
    @Operation(summary = "Supprimer une participation")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        participationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // POST /api/participations/with-player
    @Operation(summary = "Créer une participation — crée le joueur automatiquement s'il n'existe pas")
    @PostMapping("/with-player")
    public ResponseEntity<ParticipationDto> createWithPlayer(
            @RequestParam String joueurNomComplet,
            @RequestParam(required = false) String joueurPaysCode,
            @RequestParam Long tournoiId,
            @RequestParam(required = false) Integer elo,
            @RequestParam(required = false) BigDecimal pointsMarques) {
        return ResponseEntity.ok(participationService.createParticipationWithPlayerIfNeeded(
                joueurNomComplet, joueurPaysCode, tournoiId, elo, pointsMarques));
    }
}