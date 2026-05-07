package com.chess_api.service;

import com.chess_api.dto.PaysDto;
import com.chess_api.entity.Pays;
import com.chess_api.repository.PaysRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaysService {

    private final PaysRepository paysRepository;

    public List<PaysDto> findAll() {
        return paysRepository.findAll().stream()
                .map(PaysService::toDto)
                .toList();
    }

    public PaysDto findByCode(String code) {
        return paysRepository.findByCode(code)
                .map(PaysService::toDto)
                .orElseThrow(() -> new RuntimeException("Pays introuvable : " + code));
    }

    public Pays findEntityByCode(String code) {
        return paysRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Pays introuvable : " + code));
    }

    public PaysDto findById(Long id) {
        return paysRepository.findById(id)
                .map(PaysService::toDto)
                .orElseThrow(() -> new RuntimeException("Pays introuvable : " + id));
    }

    public PaysDto save(PaysDto dto) {
        Pays pays = Pays.builder()
                .nom(dto.getNom())
                .code(dto.getCode())
                .build();
        Pays saved = paysRepository.save(pays);
        return toDto(saved);
    }

    public PaysDto update(Long id, PaysDto dto) {
        Pays pays = paysRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pays introuvable : " + id));
        pays.setNom(dto.getNom());
        pays.setCode(dto.getCode());
        Pays updated = paysRepository.save(pays);
        return toDto(updated);
    }

    public void delete(Long id) {
        paysRepository.deleteById(id);
    }

    public static PaysDto toDto(Pays pays) {
        return PaysDto.builder()
                .code(pays.getCode())
                .nom(pays.getNom())
                .build();
    }
}
