package com.example.momo.service;

import com.example.momo.dao.*;
import com.example.momo.dto.*;
import com.example.momo.entity.*;
import com.example.momo.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaveSlotService {

    private final SaveSlotDao saveSlotDao;
    private final PlayerItemDao playerItemDao;
    private final PlayerCharmSlotDao playerCharmSlotDao;
    private final RoomClearRecordDao roomClearRecordDao;
    private final ShopItemDao shopItemDao;

    /**
     * Get all 3 save slots (some may be empty / null)
     */
    public List<SaveSlotDto> getAllSlots() {
        List<SaveSlot> slots = saveSlotDao.findAllByOrderBySlotNumberAsc();
        return slots.stream().map(this::toFullDto).collect(Collectors.toList());
    }

    /**
     * Get a single save slot by slot number
     */
    public SaveSlotDto getSlot(Integer slotNumber) {
        SaveSlot slot = saveSlotDao.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot " + slotNumber + " not found"));
        return toFullDto(slot);
    }

    /**
     * Get a single save slot by ID
     */
    public SaveSlotDto getSlotById(Long id) {
        SaveSlot slot = saveSlotDao.findById(id)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot with id " + id + " not found"));
        return toFullDto(slot);
    }

    /**
     * Create a new game in a slot
     */
    @Transactional
    public SaveSlotDto createNewGame(NewGameDto dto) {
        if (saveSlotDao.existsBySlotNumber(dto.getSlotNumber())) {
            throw new SlotAlreadyExistsException("Slot " + dto.getSlotNumber() + " already has a save. Delete it first.");
        }

        SaveSlot slot = SaveSlot.builder()
                .slotNumber(dto.getSlotNumber())
                .playerName(dto.getPlayerName())
                .currentRoom(1)
                .highestRoomCleared(0)
                .coins(0)
                .orbs(0)
                .orbFragments(0)
                .baseHp(100)
                .baseAttack(20)
                .baseDefense(10)
                .healthUpgradeLevel(0)
                .attackUpgradeLevel(0)
                .critRateUpgradeLevel(0)
                .playerCritRate(0.0)
                .playtimeSeconds(0L)
                .hardMode(dto.getHardMode() != null ? dto.getHardMode() : false)
                .gameCompleted(false)
                .build();

        slot = saveSlotDao.save(slot);

        // Create 3 empty charm slots
        for (int i = 1; i <= 3; i++) {
            PlayerCharmSlot charmSlot = PlayerCharmSlot.builder()
                    .saveSlotId(slot.getId())
                    .slotIndex(i)
                    .charmItemId(null)
                    .build();
            playerCharmSlotDao.save(charmSlot);
        }

        return toFullDto(slot);
    }

    /**
     * Delete a save slot and all associated data
     */
    @Transactional
    public void deleteSlot(Integer slotNumber) {
        SaveSlot slot = saveSlotDao.findBySlotNumber(slotNumber)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot " + slotNumber + " not found"));

        playerItemDao.deleteBySaveSlotId(slot.getId());
        playerCharmSlotDao.deleteBySaveSlotId(slot.getId());
        roomClearRecordDao.deleteBySaveSlotId(slot.getId());
        saveSlotDao.delete(slot);
    }

    /**
     * Update player name
     */
    @Transactional
    public SaveSlotDto updatePlayerName(Long slotId, String newName) {
        SaveSlot slot = saveSlotDao.findById(slotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));
        slot.setPlayerName(newName);
        return toFullDto(saveSlotDao.save(slot));
    }

    /**
     * Update player profile image
     */
    @Transactional
    public SaveSlotDto updateProfileImage(Long slotId, String imagePath) {
        SaveSlot slot = saveSlotDao.findById(slotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));
        slot.setProfileImage(imagePath);
        return toFullDto(saveSlotDao.save(slot));
    }

    /**
     * Update playtime
     */
    @Transactional
    public void updatePlaytime(Long slotId, Long additionalSeconds) {
        SaveSlot slot = saveSlotDao.findById(slotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));
        slot.setPlaytimeSeconds(slot.getPlaytimeSeconds() + additionalSeconds);
        saveSlotDao.save(slot);
    }

    /**
     * Equip a weapon or defense item
     */
    @Transactional
    public SaveSlotDto equipItem(EquipDto dto) {
        SaveSlot slot = saveSlotDao.findById(dto.getSaveSlotId())
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        if (dto.getItemId() != null) {
            // Verify player owns the item
            playerItemDao.findBySaveSlotIdAndShopItemId(dto.getSaveSlotId(), dto.getItemId())
                    .orElseThrow(() -> new ItemNotFoundException("Player does not own this item"));
        }

        if ("WEAPON".equalsIgnoreCase(dto.getEquipType())) {
            slot.setEquippedWeaponId(dto.getItemId());
        } else if ("DEFENSE".equalsIgnoreCase(dto.getEquipType())) {
            slot.setEquippedDefenseId(dto.getItemId());
        } else {
            throw new InvalidOperationException("Invalid equip type: " + dto.getEquipType());
        }

        return toFullDto(saveSlotDao.save(slot));
    }

    /**
     * Set charm in a slot
     */
    @Transactional
    public SaveSlotDto setCharm(Long saveSlotId, Integer slotIndex, Long charmItemId) {
        SaveSlot slot = saveSlotDao.findById(saveSlotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        if (charmItemId != null) {
            // Verify player owns the charm
            playerItemDao.findBySaveSlotIdAndShopItemId(saveSlotId, charmItemId)
                    .orElseThrow(() -> new ItemNotFoundException("Player does not own this charm"));
        }

        List<PlayerCharmSlot> charmSlots = playerCharmSlotDao.findBySaveSlotIdOrderBySlotIndexAsc(saveSlotId);
        PlayerCharmSlot targetSlot = charmSlots.stream()
                .filter(cs -> cs.getSlotIndex().equals(slotIndex))
                .findFirst()
                .orElseThrow(() -> new InvalidOperationException("Invalid charm slot index: " + slotIndex));

        targetSlot.setCharmItemId(charmItemId);
        playerCharmSlotDao.save(targetSlot);

        return toFullDto(slot);
    }

    // ==================== Helper: Convert Entity to DTO ====================

    public SaveSlotDto toFullDto(SaveSlot slot) {
        List<PlayerItem> items = playerItemDao.findBySaveSlotId(slot.getId());
        List<PlayerCharmSlot> charmSlots = playerCharmSlotDao.findBySaveSlotIdOrderBySlotIndexAsc(slot.getId());
        List<RoomClearRecord> records = roomClearRecordDao.findBySaveSlotIdOrderByRoomNumberAsc(slot.getId());

        // Compute total stats
        int totalHp = slot.getBaseHp() + (slot.getHealthUpgradeLevel() * 5); // +5 HP per level
        int totalAtk = slot.getBaseAttack() + (slot.getAttackUpgradeLevel() * 3); // +3 ATK per level
        int totalDef = slot.getBaseDefense();

        // Add weapon bonuses
        ShopItemDto equippedWeaponDto = null;
        if (slot.getEquippedWeaponId() != null) {
            ShopItem weapon = shopItemDao.findById(slot.getEquippedWeaponId()).orElse(null);
            if (weapon != null) {
                totalAtk += weapon.getAttackBonus();
                totalHp += weapon.getHpBonus();
                totalDef += weapon.getDefenseBonus();
                equippedWeaponDto = toShopItemDto(weapon);
            }
        }

        // Add defense item bonuses
        ShopItemDto equippedDefenseDto = null;
        if (slot.getEquippedDefenseId() != null) {
            ShopItem defense = shopItemDao.findById(slot.getEquippedDefenseId()).orElse(null);
            if (defense != null) {
                totalDef += defense.getDefenseBonus();
                totalHp += defense.getHpBonus();
                totalAtk += defense.getAttackBonus();
                equippedDefenseDto = toShopItemDto(defense);
            }
        }

        return SaveSlotDto.builder()
                .id(slot.getId())
                .slotNumber(slot.getSlotNumber())
                .playerName(slot.getPlayerName())
                .profileImage(slot.getProfileImage())
                .currentRoom(slot.getCurrentRoom())
                .highestRoomCleared(slot.getHighestRoomCleared())
                .coins(slot.getCoins())
                .orbs(slot.getOrbs())
                .orbFragments(slot.getOrbFragments())
                .baseHp(slot.getBaseHp())
                .baseAttack(slot.getBaseAttack())
                .baseDefense(slot.getBaseDefense())
                .healthUpgradeLevel(slot.getHealthUpgradeLevel())
                .attackUpgradeLevel(slot.getAttackUpgradeLevel())
                .critRateUpgradeLevel(slot.getCritRateUpgradeLevel())
                .playerCritRate(slot.getPlayerCritRate())
                .equippedWeaponId(slot.getEquippedWeaponId())
                .equippedDefenseId(slot.getEquippedDefenseId())
                .totalHp(totalHp)
                .totalAttack(totalAtk)
                .totalDefense(totalDef)
                .playtimeSeconds(slot.getPlaytimeSeconds())
                .hardMode(slot.getHardMode())
                .gameCompleted(slot.getGameCompleted())
                .createdAt(slot.getCreatedAt())
                .updatedAt(slot.getUpdatedAt())
                .items(items.stream().map(this::toPlayerItemDto).collect(Collectors.toList()))
                .charmSlots(charmSlots.stream().map(this::toCharmSlotDto).collect(Collectors.toList()))
                .roomClearRecords(records.stream().map(this::toRoomClearRecordDto).collect(Collectors.toList()))
                .equippedWeapon(equippedWeaponDto)
                .equippedDefense(equippedDefenseDto)
                .build();
    }

    private PlayerItemDto toPlayerItemDto(PlayerItem pi) {
        return PlayerItemDto.builder()
                .id(pi.getId())
                .saveSlotId(pi.getSaveSlotId())
                .shopItemId(pi.getShopItemId())
                .quantity(pi.getQuantity())
                .shopItem(pi.getShopItem() != null ? toShopItemDto(pi.getShopItem()) : null)
                .build();
    }

    private PlayerCharmSlotDto toCharmSlotDto(PlayerCharmSlot cs) {
        return PlayerCharmSlotDto.builder()
                .id(cs.getId())
                .saveSlotId(cs.getSaveSlotId())
                .slotIndex(cs.getSlotIndex())
                .charmItemId(cs.getCharmItemId())
                .charmItem(cs.getCharmItem() != null ? toShopItemDto(cs.getCharmItem()) : null)
                .build();
    }

    private RoomClearRecordDto toRoomClearRecordDto(RoomClearRecord r) {
        return RoomClearRecordDto.builder()
                .id(r.getId())
                .saveSlotId(r.getSaveSlotId())
                .roomNumber(r.getRoomNumber())
                .firstCleared(r.getFirstCleared())
                .clearCount(r.getClearCount())
                .lastClearedAt(r.getLastClearedAt())
                .build();
    }

    public ShopItemDto toShopItemDto(ShopItem item) {
        return ShopItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .category(item.getCategory())
                .description(item.getDescription())
                .priceCoin(item.getPriceCoin())
                .priceOrb(item.getPriceOrb())
                .iconImage(item.getIconImage())
                .attackBonus(item.getAttackBonus())
                .defenseBonus(item.getDefenseBonus())
                .hpBonus(item.getHpBonus())
                .healAmount(item.getHealAmount())
                .specialEffect(item.getSpecialEffect())
                .effectParams(item.getEffectParams())
                .permanent(item.getPermanent())
                .maxUsesPerMatch(item.getMaxUsesPerMatch())
                .active(item.getActive())
                .build();
    }
}
