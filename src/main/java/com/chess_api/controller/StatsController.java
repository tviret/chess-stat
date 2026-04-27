package com.chess_api.controller;

import com.chess_api.dto.OuvertureStatsDto;
import com.chess_api.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    // GET /api/stats/ouvertures?pays=fr
    @GetMapping("/ouvertures")
    public ResponseEntity<List<OuvertureStatsDto>> getTopOuvertures(
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) String joueur
    ) {
        if (pays != null)   return ResponseEntity.ok(statsService.getTopOuverturesByPays(pays));
        if (joueur != null) return ResponseEntity.ok(statsService.getTopOuverturesByJoueur(joueur));
        return ResponseEntity.badRequest().build();
    }
}
