package com.example.momo.service;

import com.example.momo.dao.*;
import com.example.momo.dto.*;
import com.example.momo.entity.*;
import com.example.momo.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BattleService {

    private final SaveSlotDao saveSlotDao;
    private final EnemyDao enemyDao;
    private final RoomRewardDao roomRewardDao;
    private final RoomClearRecordDao roomClearRecordDao;
    private final PlayerItemDao playerItemDao;
    private final ShopItemDao shopItemDao;

    /**
     * Get enemy data for a room (applies Hard mode multiplier if needed)
     */
    public EnemyDto getEnemyForRoom(Long saveSlotId, Integer roomNumber) {
        SaveSlot slot = saveSlotDao.findById(saveSlotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        Enemy enemy = enemyDao.findByRoomNumberAndActiveTrue(roomNumber)
                .orElseThrow(() -> new EnemyNotFoundException("No enemy found for room " + roomNumber));

        EnemyDto dto = EnemyDto.builder()
                .id(enemy.getId())
                .name(enemy.getName())
                .roomNumber(enemy.getRoomNumber())
                .hp(enemy.getHp())
                .attack(enemy.getAttack())
                .defense(enemy.getDefense())
                .reduceDamageChance(enemy.getReduceDamageChance())
                .damageReductionOptions(enemy.getDamageReductionOptions())
                .critChance(enemy.getCritChance())
                .critDamageOptions(enemy.getCritDamageOptions())
                .spriteImage(enemy.getSpriteImage())
                .active(enemy.getActive())
                .build();

        // Apply Hard mode: 2x HP and attack
        if (slot.getHardMode()) {
            dto.setHp(dto.getHp() * 2);
            dto.setAttack(dto.getAttack() * 2);
        }

        return dto;
    }

    /**
     * Process battle victory - grant rewards and update progress
     */
    @Transactional
    public BattleResultDto processBattleVictory(Long saveSlotId, Integer roomNumber) {
        SaveSlot slot = saveSlotDao.findById(saveSlotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        RoomReward reward = roomRewardDao.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new InvalidOperationException("No reward config for room " + roomNumber));

        // Check if first clear
        RoomClearRecord record = roomClearRecordDao
                .findBySaveSlotIdAndRoomNumber(saveSlotId, roomNumber)
                .orElse(null);

        boolean isFirstClear = (record == null || !record.getFirstCleared());

        int coinsEarned = 0;
        int orbsEarned = 0;
        int orbFragmentsEarned = 0;

        // Calculate coin multiplier from Greed Dagger
        double coinMultiplier = 1.0;
        double orbChance = 0.0;
        if (slot.getEquippedWeaponId() != null) {
            ShopItem weapon = shopItemDao.findById(slot.getEquippedWeaponId()).orElse(null);
            if (weapon != null && "GREED_BOOST".equals(weapon.getSpecialEffect())) {
                coinMultiplier = 1.2;
                orbChance = 0.18; // 18% chance for orb bonus
            }
        }

        if (isFirstClear) {
            coinsEarned = (int) (reward.getFirstClearCoins() * coinMultiplier);
            orbsEarned = reward.getFirstClearOrbs();

            // Apply orb chance bonus from Greed Dagger on first clear
            if (orbChance > 0 && Math.random() < orbChance) {
                orbsEarned += 1;
            }
        } else {
            // Replay rewards
            coinsEarned = (int) (reward.getReplayCoins() * coinMultiplier);
            orbFragmentsEarned = reward.getReplayOrbFragments();

            if (orbChance > 0 && Math.random() < orbChance) {
                orbFragmentsEarned += 1;
            }
        }

        // Update player currencies
        slot.setCoins(slot.getCoins() + coinsEarned);
        slot.setOrbs(slot.getOrbs() + orbsEarned);
        slot.setOrbFragments(slot.getOrbFragments() + orbFragmentsEarned);

        // Update progress
        if (roomNumber > slot.getHighestRoomCleared()) {
            slot.setHighestRoomCleared(roomNumber);
        }
        if (roomNumber < 13) {
            slot.setCurrentRoom(roomNumber + 1);
        }

        // Check if game completed
        if (roomNumber == 13 && !slot.getGameCompleted()) {
            slot.setGameCompleted(true);
        }

        saveSlotDao.save(slot);

        // Update or create clear record
        if (record == null) {
            record = RoomClearRecord.builder()
                    .saveSlotId(saveSlotId)
                    .roomNumber(roomNumber)
                    .firstCleared(true)
                    .clearCount(1)
                    .lastClearedAt(LocalDateTime.now())
                    .build();
        } else {
            record.setFirstCleared(true);
            record.setClearCount(record.getClearCount() + 1);
            record.setLastClearedAt(LocalDateTime.now());
        }
        roomClearRecordDao.save(record);

        return BattleResultDto.builder()
                .saveSlotId(saveSlotId)
                .roomNumber(roomNumber)
                .victory(true)
                .firstClear(isFirstClear)
                .coinsEarned(coinsEarned)
                .orbsEarned(orbsEarned)
                .orbFragmentsEarned(orbFragmentsEarned)
                .coinMultiplier(coinMultiplier)
                .orbChance(orbChance)
                .build();
    }

    /**
     * Use a potion from inventory during battle (reduce quantity by 1)
     */
    @Transactional
    public PlayerItemDto usePotion(Long saveSlotId, Long shopItemId) {
        PlayerItem playerItem = playerItemDao.findBySaveSlotIdAndShopItemId(saveSlotId, shopItemId)
                .orElseThrow(() -> new ItemNotFoundException("Player does not own this potion"));

        ShopItem item = shopItemDao.findById(shopItemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found"));

        if (!"POTION".equalsIgnoreCase(item.getCategory())) {
            throw new InvalidOperationException("This item is not a potion");
        }

        if (playerItem.getQuantity() <= 0) {
            throw new InvalidOperationException("No potions remaining");
        }

        playerItem.setQuantity(playerItem.getQuantity() - 1);

        if (playerItem.getQuantity() <= 0) {
            playerItemDao.delete(playerItem);
            return PlayerItemDto.builder()
                    .id(playerItem.getId())
                    .saveSlotId(saveSlotId)
                    .shopItemId(shopItemId)
                    .quantity(0)
                    .build();
        } else {
            playerItemDao.save(playerItem);
            return PlayerItemDto.builder()
                    .id(playerItem.getId())
                    .saveSlotId(saveSlotId)
                    .shopItemId(shopItemId)
                    .quantity(playerItem.getQuantity())
                    .shopItem(playerItem.getShopItem() != null ?
                            saveSlotService_toShopItemDto(playerItem.getShopItem()) : null)
                    .build();
        }
    }

    private final SaveSlotService saveSlotService;

    private ShopItemDto saveSlotService_toShopItemDto(ShopItem item) {
        return saveSlotService.toShopItemDto(item);
    }
}
