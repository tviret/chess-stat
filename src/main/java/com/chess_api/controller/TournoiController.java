package com.chess_api.controller;

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
    // GET /api/tournois?debut=2026-01-01&fin=2026-06-30
    @GetMapping
    public ResponseEntity<List<TournoiDto>> findAll(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String pays,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate debut,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin
    ) {
        if (nom != null)                    return ResponseEntity.ok(tournoiService.search(nom));
        if (pays != null)                   return ResponseEntity.ok(tournoiService.findByPays(pays));
        if (debut != null && fin != null)   return ResponseEntity.ok(tournoiService.findByDateRange(debut, fin));
        return ResponseEntity.ok(tournoiService.findAll());
    }

    // GET /api/tournois/{id}/stats
    @GetMapping("/{id}/stats")
    public ResponseEntity<TournoiStatsDto> getStats(@PathVariable Long id) {
        return ResponseEntity.ok(tournoiService.getStats(id));
    }
}
