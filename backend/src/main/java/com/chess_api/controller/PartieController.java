package com.chess_api.controller;

import com.chess_api.dto.PartieDto;
import com.chess_api.service.PartieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Parties", description = "Gestion des parties d'échecs")
@RestController
@RequestMapping("/api/parties")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartieController {

    private final PartieService partieService;

    // GET /api/parties
    @Operation(summary = "Lister toutes les parties")
    @GetMapping
    public ResponseEntity<List<PartieDto>> findAll() {
        return ResponseEntity.ok(partieService.findAll());
    }

    // GET /api/parties/{id}
    @Operation(summary = "Récupérer une partie par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<PartieDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(partieService.findById(id));
    }

    // POST /api/parties
    @Operation(summary = "Créer une partie")
    @PostMapping
    public ResponseEntity<PartieDto> create(@RequestBody PartieDto dto) {
        return ResponseEntity.ok(partieService.save(dto));
    }

    // PUT /api/parties/{id}
    @Operation(summary = "Modifier une partie")
    @PutMapping("/{id}")
    public ResponseEntity<PartieDto> update(@PathVariable Long id, @RequestBody PartieDto dto) {
        return ResponseEntity.ok(partieService.update(id, dto));
    }

    // DELETE /api/parties/{id}
    @Operation(summary = "Supprimer une partie")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        partieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}