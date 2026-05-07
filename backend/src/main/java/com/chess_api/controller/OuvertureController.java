package com.chess_api.controller;

import com.chess_api.dto.OuvertureDto;
import com.chess_api.service.OuvertureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ouvertures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OuvertureController {

    private final OuvertureService ouvertureService;

    // GET /api/ouvertures
    @GetMapping
    public ResponseEntity<List<OuvertureDto>> findAll() {
        return ResponseEntity.ok(ouvertureService.findAll());
    }

    // GET /api/ouvertures/{id}
    @GetMapping("/{id}")
    public ResponseEntity<OuvertureDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ouvertureService.findById(id));
    }

    // POST /api/ouvertures
    @PostMapping
    public ResponseEntity<OuvertureDto> create(@RequestBody OuvertureDto dto) {
        return ResponseEntity.ok(ouvertureService.save(dto));
    }

    // PUT /api/ouvertures/{id}
    @PutMapping("/{id}")
    public ResponseEntity<OuvertureDto> update(@PathVariable Long id, @RequestBody OuvertureDto dto) {
        return ResponseEntity.ok(ouvertureService.update(id, dto));
    }

    // DELETE /api/ouvertures/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ouvertureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}