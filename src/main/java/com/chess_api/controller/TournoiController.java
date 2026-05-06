package com.chess_api.controller;

import com.chess_api.dto.ParticipationDto;
import com.chess_api.dto.TournoiDto;
import com.chess_api.dto.TournoiStatsDto;
import com.chess_api.service.TournoiService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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
    // GET /api/tournois?pays=fr&debut=2024-01-01   ← combinaisons
    @GetMapping
    public ResponseEntity<List<TournoiDto>> findAll(
            @RequestParam(required = false) String    nom,
            @RequestParam(required = false) String    pays,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        return ResponseEntity.ok(tournoiService.search(nom, pays, debut, fin));
    }

    // GET /api/tournois/{id}/stats
    @GetMapping("/{id}/stats")
    public ResponseEntity<TournoiStatsDto> getStats(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.getStats(id));
    }

    // GET /api/tournois/{id}/stats
    @GetMapping("/{id}/participations")
    public ResponseEntity<List<ParticipationDto>> getParticipations(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.getParticipations(id));
    }
}
