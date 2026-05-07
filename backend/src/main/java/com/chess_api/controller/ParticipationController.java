package com.chess_api.controller;

import com.chess_api.dto.ParticipationDto;
import com.chess_api.service.ParticipationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParticipationController {

    private final ParticipationService participationService;

    // GET /api/participations
    @GetMapping
    public ResponseEntity<List<ParticipationDto>> findAll() {
        return ResponseEntity.ok(participationService.findAll());
    }

    // GET /api/participations/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ParticipationDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(participationService.findById(id));
    }

    // POST /api/participations
    @PostMapping
    public ResponseEntity<ParticipationDto> create(@RequestBody ParticipationDto dto) {
        return ResponseEntity.ok(participationService.save(dto));
    }

    // PUT /api/participations/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ParticipationDto> update(@PathVariable Long id, @RequestBody ParticipationDto dto) {
        return ResponseEntity.ok(participationService.update(id, dto));
    }

    // DELETE /api/participations/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        participationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}