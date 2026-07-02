package com.example.momo.controller;

import com.example.momo.dto.*;
import com.example.momo.service.OrbUpgradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/upgrade")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UpgradeController {

    private final OrbUpgradeService orbUpgradeService;

    @GetMapping("/info/{saveSlotId}")
    public ResponseEntity<OrbUpgradeService.UpgradeInfoResponse> getUpgradeInfo(@PathVariable Long saveSlotId) {
        return ResponseEntity.ok(orbUpgradeService.getUpgradeInfo(saveSlotId));
    }

    @PostMapping
    public ResponseEntity<SaveSlotDto> performUpgrade(@RequestBody OrbUpgradeDto dto) {
        return ResponseEntity.ok(orbUpgradeService.performUpgrade(dto));
    }
}
