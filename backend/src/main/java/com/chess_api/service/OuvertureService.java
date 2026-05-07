package com.chess_api.service;

import com.chess_api.dto.OuvertureDto;
import com.chess_api.entity.Ouverture;
import com.chess_api.repository.OuvertureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OuvertureService {

    private final OuvertureRepository ouvertureRepository;

    public List<OuvertureDto> findAll() {
        return ouvertureRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public OuvertureDto findById(Long id) {
        Ouverture ouverture = ouvertureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ouverture introuvable : " + id));
        return toDto(ouverture);
    }

    public OuvertureDto save(OuvertureDto dto) {
        Ouverture ouverture = Ouverture.builder()
                .codeEco(dto.getCodeEco())
                .libelle(dto.getLibelle())
                .build();
        Ouverture saved = ouvertureRepository.save(ouverture);
        return toDto(saved);
    }

    public OuvertureDto update(Long id, OuvertureDto dto) {
        Ouverture ouverture = ouvertureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ouverture introuvable : " + id));
        ouverture.setCodeEco(dto.getCodeEco());
        ouverture.setLibelle(dto.getLibelle());
        Ouverture updated = ouvertureRepository.save(ouverture);
        return toDto(updated);
    }

    public void delete(Long id) {
        ouvertureRepository.deleteById(id);
    }

    public OuvertureDto toDto(Ouverture ouverture) {
        return OuvertureDto.builder()
                .id(ouverture.getId())
                .codeEco(ouverture.getCodeEco())
                .libelle(ouverture.getLibelle())
                .build();
    }
}