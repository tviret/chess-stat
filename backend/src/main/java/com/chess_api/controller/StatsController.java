package com.chess_api.controller;

import com.chess_api.dto.OuvertureStatsDto;
import com.chess_api.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Statistiques", description = "Statistiques globales par pays ou joueur")
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    // GET /api/stats/ouvertures?pays=fr
    @Operation(summary = "Top ouvertures par pays (pays=fr) ou par joueur (joueur=Magnus Carlsen)")
    @GetMapping("/ouvertures")
    public ResponseEntity<List<OuvertureStatsDto>> getTopOuvertures(
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) String joueur) {
        if (pays != null)
            return ResponseEntity.ok(statsService.getTopOuverturesByPays(pays));
        if (joueur != null)
            return ResponseEntity.ok(statsService.getTopOuverturesByJoueur(joueur));
        return ResponseEntity.badRequest().build();
    }
}
