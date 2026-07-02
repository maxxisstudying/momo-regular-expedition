package com.example.momo.controller;

import com.example.momo.dto.*;
import com.example.momo.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShopController {

    private final ShopService shopService;

    @GetMapping("/items")
    public ResponseEntity<List<ShopItemDto>> getAllActiveItems() {
        return ResponseEntity.ok(shopService.getAllActiveItems());
    }

    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<ShopItemDto>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(shopService.getItemsByCategory(category));
    }

    @PostMapping("/purchase")
    public ResponseEntity<SaveSlotDto> purchaseItem(@RequestBody PurchaseDto dto) {
        return ResponseEntity.ok(shopService.purchaseItem(dto));
    }

    @GetMapping("/player/{saveSlotId}/items")
    public ResponseEntity<List<PlayerItemDto>> getPlayerItems(@PathVariable Long saveSlotId) {
        return ResponseEntity.ok(shopService.getPlayerItems(saveSlotId));
    }

    @GetMapping("/player/{saveSlotId}/items/category/{category}")
    public ResponseEntity<List<PlayerItemDto>> getPlayerItemsByCategory(
            @PathVariable Long saveSlotId,
            @PathVariable String category
    ) {
        return ResponseEntity.ok(shopService.getPlayerItemsByCategory(saveSlotId, category));
    }
}
