package com.chess_api.controller;

import com.chess_api.dto.PaysDto;
import com.chess_api.service.PaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pays")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaysController {

    private final PaysService paysService;

    // GET /api/pays
    @GetMapping
    public ResponseEntity<List<PaysDto>> findAll() {
        return ResponseEntity.ok(paysService.findAll());
    }

    // GET /api/pays/{code}
    @GetMapping("/{code}")
    public ResponseEntity<PaysDto> findByCode(@PathVariable String code) {
        return ResponseEntity.ok(paysService.findByCode(code));
    }
}
