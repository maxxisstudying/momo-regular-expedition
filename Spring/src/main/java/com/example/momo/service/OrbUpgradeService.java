package com.example.momo.service;

import com.example.momo.dao.SaveSlotDao;
import com.example.momo.dto.OrbUpgradeDto;
import com.example.momo.dto.SaveSlotDto;
import com.example.momo.entity.SaveSlot;
import com.example.momo.exception.InsufficientFundsException;
import com.example.momo.exception.InvalidOperationException;
import com.example.momo.exception.SaveSlotNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrbUpgradeService {

    private final SaveSlotDao saveSlotDao;
    private final SaveSlotService saveSlotService;

    /**
     * Get the orb cost for a given upgrade level.
     * Level 0 -> 1 (first time): FREE
     * Level 1 -> 20: costs 1 orb each
     * Level 20+: costs 2 orbs each
     */
    public int getUpgradeCost(int currentLevel) {
        if (currentLevel == 0) return 0; // First upgrade is free
        if (currentLevel < 20) return 1;
        return 2;
    }

    /**
     * Perform an orb upgrade
     */
    @Transactional
    public SaveSlotDto performUpgrade(OrbUpgradeDto dto) {
        SaveSlot slot = saveSlotDao.findById(dto.getSaveSlotId())
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        String type = dto.getUpgradeType().toUpperCase();

        int currentLevel;
        switch (type) {
            case "HEALTH":
                currentLevel = slot.getHealthUpgradeLevel();
                break;
            case "ATTACK":
                currentLevel = slot.getAttackUpgradeLevel();
                break;
            case "CRIT_RATE":
                currentLevel = slot.getCritRateUpgradeLevel();
                break;
            default:
                throw new InvalidOperationException("Invalid upgrade type: " + type);
        }

        int cost = getUpgradeCost(currentLevel);

        if (slot.getOrbs() < cost) {
            throw new InsufficientFundsException("Not enough orbs. Need " + cost + " but have " + slot.getOrbs());
        }

        // Deduct orbs
        slot.setOrbs(slot.getOrbs() - cost);

        // Apply upgrade
        switch (type) {
            case "HEALTH":
                slot.setHealthUpgradeLevel(currentLevel + 1);
                slot.setBaseHp(slot.getBaseHp() + 5); // +5 HP per upgrade
                break;
            case "ATTACK":
                slot.setAttackUpgradeLevel(currentLevel + 1);
                slot.setBaseAttack(slot.getBaseAttack() + 3); // +3 ATK per upgrade
                break;
            case "CRIT_RATE":
                slot.setCritRateUpgradeLevel(currentLevel + 1);
                slot.setPlayerCritRate(slot.getPlayerCritRate() + 0.5); // +0.5% crit rate per upgrade
                break;
        }

        saveSlotDao.save(slot);
        return saveSlotService.toFullDto(slot);
    }

    /**
     * Get info about upgrade costs for display
     */
    public UpgradeInfoResponse getUpgradeInfo(Long saveSlotId) {
        SaveSlot slot = saveSlotDao.findById(saveSlotId)
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        return new UpgradeInfoResponse(
                slot.getHealthUpgradeLevel(),
                getUpgradeCost(slot.getHealthUpgradeLevel()),
                slot.getAttackUpgradeLevel(),
                getUpgradeCost(slot.getAttackUpgradeLevel()),
                slot.getCritRateUpgradeLevel(),
                getUpgradeCost(slot.getCritRateUpgradeLevel()),
                slot.getOrbs()
        );
    }

    @lombok.Getter
    @lombok.AllArgsConstructor
    public static class UpgradeInfoResponse {
        private int healthLevel;
        private int healthCost;
        private int attackLevel;
        private int attackCost;
        private int critRateLevel;
        private int critRateCost;
        private int currentOrbs;
    }
}
