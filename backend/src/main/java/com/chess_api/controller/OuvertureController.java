package com.chess_api.controller;

import com.chess_api.dto.OuvertureDto;
import com.chess_api.service.OuvertureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Ouvertures", description = "Gestion des ouvertures d'échecs (code ECO)")
@RestController
@RequestMapping("/api/ouvertures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OuvertureController {

    private final OuvertureService ouvertureService;

    // GET /api/ouvertures
    @Operation(summary = "Lister toutes les ouvertures")
    @GetMapping
    public ResponseEntity<List<OuvertureDto>> findAll() {
        return ResponseEntity.ok(ouvertureService.findAll());
    }

    // GET /api/ouvertures/{id}
    @Operation(summary = "Récupérer une ouverture par son ID")
    @GetMapping("/{id}")
    public ResponseEntity<OuvertureDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ouvertureService.findById(id));
    }

    // POST /api/ouvertures
    @Operation(summary = "Créer une ouverture")
    @PostMapping
    public ResponseEntity<OuvertureDto> create(@RequestBody OuvertureDto dto) {
        return ResponseEntity.ok(ouvertureService.save(dto));
    }

    // PUT /api/ouvertures/{id}
    @Operation(summary = "Modifier une ouverture")
    @PutMapping("/{id}")
    public ResponseEntity<OuvertureDto> update(@PathVariable Long id, @RequestBody OuvertureDto dto) {
        return ResponseEntity.ok(ouvertureService.update(id, dto));
    }

    // DELETE /api/ouvertures/{id}
    @Operation(summary = "Supprimer une ouverture")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ouvertureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}