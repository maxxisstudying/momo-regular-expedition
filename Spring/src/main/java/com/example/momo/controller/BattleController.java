package com.example.momo.controller;

import com.example.momo.dto.*;
import com.example.momo.service.BattleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/battle")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BattleController {

    private final BattleService battleService;

    @GetMapping("/enemy/{saveSlotId}/{roomNumber}")
    public ResponseEntity<EnemyDto> getEnemyForRoom(
            @PathVariable Long saveSlotId,
            @PathVariable Integer roomNumber
    ) {
        return ResponseEntity.ok(battleService.getEnemyForRoom(saveSlotId, roomNumber));
    }

    @PostMapping("/victory")
    public ResponseEntity<BattleResultDto> processBattleVictory(@RequestBody Map<String, Object> body) {
        Long saveSlotId = ((Number) body.get("saveSlotId")).longValue();
        Integer roomNumber = (Integer) body.get("roomNumber");
        return ResponseEntity.ok(battleService.processBattleVictory(saveSlotId, roomNumber));
    }

    @PostMapping("/use-potion")
    public ResponseEntity<PlayerItemDto> usePotion(@RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(battleService.usePotion(body.get("saveSlotId"), body.get("shopItemId")));
    }
}
