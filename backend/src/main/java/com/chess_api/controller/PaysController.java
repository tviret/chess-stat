package com.chess_api.controller;

import com.chess_api.dto.PaysDto;
import com.chess_api.service.PaysService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Pays", description = "Gestion des pays")
@RestController
@RequestMapping("/api/pays")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaysController {

    private final PaysService paysService;

    // GET /api/pays
    @Operation(summary = "Lister tous les pays")
    @GetMapping
    public ResponseEntity<List<PaysDto>> findAll() {
        return ResponseEntity.ok(paysService.findAll());
    }

    // GET /api/pays/{code}
    @Operation(summary = "Récupérer un pays par son code (ex: fr, no, us)")
    @GetMapping("/{code}")
    public ResponseEntity<PaysDto> findByCode(@PathVariable String code) {
        return ResponseEntity.ok(paysService.findByCode(code));
    }

    // GET /api/pays/id/{id}
    @Operation(summary = "Récupérer un pays par son ID")
    @GetMapping("/id/{id}")
    public ResponseEntity<PaysDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(paysService.findById(id));
    }

    // POST /api/pays
    @Operation(summary = "Créer un pays")
    @PostMapping
    public ResponseEntity<PaysDto> create(@RequestBody PaysDto dto) {
        return ResponseEntity.ok(paysService.save(dto));
    }

    // PUT /api/pays/{id}
    @Operation(summary = "Modifier un pays")
    @PutMapping("/{id}")
    public ResponseEntity<PaysDto> update(@PathVariable Long id, @RequestBody PaysDto dto) {
        return ResponseEntity.ok(paysService.update(id, dto));
    }

    // DELETE /api/pays/{id}
    @Operation(summary = "Supprimer un pays")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paysService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
