package com.example.momo.controller;

import com.example.momo.dto.*;
import com.example.momo.service.SaveSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SaveSlotController {

    private final SaveSlotService saveSlotService;

    @GetMapping
    public ResponseEntity<List<SaveSlotDto>> getAllSlots() {
        return ResponseEntity.ok(saveSlotService.getAllSlots());
    }

    @GetMapping("/{slotNumber}")
    public ResponseEntity<SaveSlotDto> getSlot(@PathVariable Integer slotNumber) {
        return ResponseEntity.ok(saveSlotService.getSlot(slotNumber));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<SaveSlotDto> getSlotById(@PathVariable Long id) {
        return ResponseEntity.ok(saveSlotService.getSlotById(id));
    }

    @PostMapping
    public ResponseEntity<SaveSlotDto> createNewGame(@RequestBody NewGameDto dto) {
        return ResponseEntity.ok(saveSlotService.createNewGame(dto));
    }

    @DeleteMapping("/{slotNumber}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Integer slotNumber) {
        saveSlotService.deleteSlot(slotNumber);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{slotId}/name")
    public ResponseEntity<SaveSlotDto> updatePlayerName(
            @PathVariable Long slotId,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(saveSlotService.updatePlayerName(slotId, body.get("newName")));
    }

    @PutMapping("/{slotId}/profile-image")
    public ResponseEntity<SaveSlotDto> updateProfileImage(
            @PathVariable Long slotId,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(saveSlotService.updateProfileImage(slotId, body.get("imagePath")));
    }

    @PutMapping("/{slotId}/playtime")
    public ResponseEntity<Void> updatePlaytime(
            @PathVariable Long slotId,
            @RequestBody Map<String, Long> body
    ) {
        saveSlotService.updatePlaytime(slotId, body.get("additionalSeconds"));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/equip")
    public ResponseEntity<SaveSlotDto> equipItem(@RequestBody EquipDto dto) {
        return ResponseEntity.ok(saveSlotService.equipItem(dto));
    }

    @PutMapping("/charm")
    public ResponseEntity<SaveSlotDto> setCharm(@RequestBody Map<String, Object> body) {
        Long saveSlotId = ((Number) body.get("saveSlotId")).longValue();
        Integer slotIndex = (Integer) body.get("slotIndex");
        Long charmItemId = body.get("charmItemId") != null 
                ? ((Number) body.get("charmItemId")).longValue() 
                : null;
        return ResponseEntity.ok(saveSlotService.setCharm(saveSlotId, slotIndex, charmItemId));
    }
}
