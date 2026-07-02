package com.example.momo.controller;

import com.example.momo.dto.*;
import com.example.momo.service.DevService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dev")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DevController {

    private final DevService devService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody DevLoginDto dto) {
        boolean success = devService.verifyLogin(dto.getUsername(), dto.getPassword());
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", success ? "Login successful" : "Invalid credentials");
        return ResponseEntity.ok(response);
    }

    // ==================== Enemy Endpoints ====================

    @GetMapping("/enemies")
    public ResponseEntity<List<EnemyDto>> getAllEnemies() {
        return ResponseEntity.ok(devService.getAllEnemies());
    }

    @PostMapping("/enemies")
    public ResponseEntity<EnemyDto> createEnemy(@RequestBody EnemyDto dto) {
        return ResponseEntity.ok(devService.createEnemy(dto));
    }

    @PutMapping("/enemies/{id}")
    public ResponseEntity<EnemyDto> updateEnemy(@PathVariable Long id, @RequestBody EnemyDto dto) {
        return ResponseEntity.ok(devService.updateEnemy(id, dto));
    }

    @DeleteMapping("/enemies/{id}")
    public ResponseEntity<Void> deleteEnemy(@PathVariable Long id) {
        devService.deleteEnemy(id);
        return ResponseEntity.ok().build();
    }

    // ==================== Shop Item Endpoints ====================

    @GetMapping("/shop-items")
    public ResponseEntity<List<ShopItemDto>> getAllShopItems() {
        return ResponseEntity.ok(devService.getAllShopItems());
    }

    @PostMapping("/shop-items")
    public ResponseEntity<ShopItemDto> createShopItem(@RequestBody ShopItemDto dto) {
        return ResponseEntity.ok(devService.createShopItem(dto));
    }

    @PutMapping("/shop-items/{id}")
    public ResponseEntity<ShopItemDto> updateShopItem(@PathVariable Long id, @RequestBody ShopItemDto dto) {
        return ResponseEntity.ok(devService.updateShopItem(id, dto));
    }

    @DeleteMapping("/shop-items/{id}")
    public ResponseEntity<Void> deleteShopItem(@PathVariable Long id) {
        devService.deleteShopItem(id);
        return ResponseEntity.ok().build();
    }

    // ==================== Room Reward Endpoints ====================

    @GetMapping("/rewards")
    public ResponseEntity<List<RoomRewardDto>> getAllRewards() {
        return ResponseEntity.ok(devService.getAllRewards());
    }

    @PutMapping("/rewards/{id}")
    public ResponseEntity<RoomRewardDto> updateReward(@PathVariable Long id, @RequestBody RoomRewardDto dto) {
        return ResponseEntity.ok(devService.updateReward(id, dto));
    }

    // ==================== Game Config Endpoints ====================

    @GetMapping("/configs")
    public ResponseEntity<List<GameConfigDto>> getAllConfigs() {
        return ResponseEntity.ok(devService.getAllConfigs());
    }

    @PutMapping("/configs/{id}")
    public ResponseEntity<GameConfigDto> updateConfig(@PathVariable Long id, @RequestBody GameConfigDto dto) {
        return ResponseEntity.ok(devService.updateConfig(id, dto));
    }
}
