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

    public static PaysDto toDto(Pays pays) {
        return PaysDto.builder()
                .code(pays.getCode())
                .nom(pays.getNom())
                .build();
    }
}
