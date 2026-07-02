package com.example.momo.service;

import com.example.momo.dao.*;
import com.example.momo.dto.*;
import com.example.momo.entity.*;
import com.example.momo.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopItemDao shopItemDao;
    private final PlayerItemDao playerItemDao;
    private final SaveSlotDao saveSlotDao;
    private final SaveSlotService saveSlotService;

    /**
     * Get all active shop items
     */
    public List<ShopItemDto> getAllActiveItems() {
        return shopItemDao.findByActiveTrue().stream()
                .map(saveSlotService::toShopItemDto)
                .collect(Collectors.toList());
    }

    /**
     * Get shop items by category
     */
    public List<ShopItemDto> getItemsByCategory(String category) {
        return shopItemDao.findByCategoryAndActiveTrue(category.toUpperCase()).stream()
                .map(saveSlotService::toShopItemDto)
                .collect(Collectors.toList());
    }

    /**
     * Purchase an item
     */
    @Transactional
    public SaveSlotDto purchaseItem(PurchaseDto dto) {
        SaveSlot slot = saveSlotDao.findById(dto.getSaveSlotId())
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        ShopItem item = shopItemDao.findById(dto.getShopItemId())
                .orElseThrow(() -> new ItemNotFoundException("Shop item not found"));

        int quantity = dto.getQuantity() != null && dto.getQuantity() > 0 ? dto.getQuantity() : 1;

        // For permanent items, check if player already owns it
        if (item.getPermanent()) {
            boolean alreadyOwns = playerItemDao.findBySaveSlotIdAndShopItemId(slot.getId(), item.getId()).isPresent();
            if (alreadyOwns) {
                throw new InvalidOperationException("You already own this permanent item: " + item.getName());
            }
            quantity = 1; // Can only buy 1 of permanent items
        }

        // Calculate total cost
        int totalCoinCost = item.getPriceCoin() * quantity;
        int totalOrbCost = item.getPriceOrb() * quantity;

        if (slot.getCoins() < totalCoinCost) {
            throw new InsufficientFundsException("Not enough coins. Need " + totalCoinCost + " but have " + slot.getCoins());
        }
        if (slot.getOrbs() < totalOrbCost) {
            throw new InsufficientFundsException("Not enough orbs. Need " + totalOrbCost + " but have " + slot.getOrbs());
        }

        // Deduct currency
        slot.setCoins(slot.getCoins() - totalCoinCost);
        slot.setOrbs(slot.getOrbs() - totalOrbCost);
        saveSlotDao.save(slot);

        // Add item to player inventory
        PlayerItem existingPlayerItem = playerItemDao
                .findBySaveSlotIdAndShopItemId(slot.getId(), item.getId())
                .orElse(null);

        if (existingPlayerItem != null) {
            // Already has some, add quantity (for potions)
            existingPlayerItem.setQuantity(existingPlayerItem.getQuantity() + quantity);
            playerItemDao.save(existingPlayerItem);
        } else {
            PlayerItem newPlayerItem = PlayerItem.builder()
                    .saveSlotId(slot.getId())
                    .shopItemId(item.getId())
                    .quantity(quantity)
                    .build();
            playerItemDao.save(newPlayerItem);
        }

        return saveSlotService.toFullDto(slot);
    }

    /**
     * Get player's inventory
     */
    public List<PlayerItemDto> getPlayerItems(Long saveSlotId) {
        List<PlayerItem> items = playerItemDao.findBySaveSlotId(saveSlotId);
        return items.stream().map(pi -> PlayerItemDto.builder()
                .id(pi.getId())
                .saveSlotId(pi.getSaveSlotId())
                .shopItemId(pi.getShopItemId())
                .quantity(pi.getQuantity())
                .shopItem(pi.getShopItem() != null ? saveSlotService.toShopItemDto(pi.getShopItem()) : null)
                .build()
        ).collect(Collectors.toList());
    }

    /**
     * Get player's items by category
     */
    public List<PlayerItemDto> getPlayerItemsByCategory(Long saveSlotId, String category) {
        List<PlayerItem> items = playerItemDao.findBySaveSlotIdAndShopItem_Category(saveSlotId, category.toUpperCase());
        return items.stream().map(pi -> PlayerItemDto.builder()
                .id(pi.getId())
                .saveSlotId(pi.getSaveSlotId())
                .shopItemId(pi.getShopItemId())
                .quantity(pi.getQuantity())
                .shopItem(pi.getShopItem() != null ? saveSlotService.toShopItemDto(pi.getShopItem()) : null)
                .build()
        ).collect(Collectors.toList());
    }
}
