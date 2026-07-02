package com.example.momo.service;

import com.example.momo.dao.SaveSlotDao;
import com.example.momo.dto.SaveSlotDto;
import com.example.momo.dto.TradeDto;
import com.example.momo.entity.SaveSlot;
import com.example.momo.exception.InsufficientFundsException;
import com.example.momo.exception.InvalidOperationException;
import com.example.momo.exception.SaveSlotNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final SaveSlotDao saveSlotDao;
    private final SaveSlotService saveSlotService;

    /**
     * Perform a trade:
     * - FRAGMENTS_TO_ORB: 10 orb fragments -> 1 orb
     * - COINS_TO_ORB: 5000 coins -> 1 orb
     */
    @Transactional
    public SaveSlotDto performTrade(TradeDto dto) {
        SaveSlot slot = saveSlotDao.findById(dto.getSaveSlotId())
                .orElseThrow(() -> new SaveSlotNotFoundException("Save slot not found"));

        int quantity = dto.getQuantity() != null && dto.getQuantity() > 0 ? dto.getQuantity() : 1;
        String type = dto.getTradeType().toUpperCase();

        switch (type) {
            case "FRAGMENTS_TO_ORB": {
                int fragmentsNeeded = 10 * quantity;
                if (slot.getOrbFragments() < fragmentsNeeded) {
                    throw new InsufficientFundsException(
                            "Not enough orb fragments. Need " + fragmentsNeeded + " but have " + slot.getOrbFragments());
                }
                slot.setOrbFragments(slot.getOrbFragments() - fragmentsNeeded);
                slot.setOrbs(slot.getOrbs() + quantity);
                break;
            }
            case "COINS_TO_ORB": {
                int coinsNeeded = 5000 * quantity;
                if (slot.getCoins() < coinsNeeded) {
                    throw new InsufficientFundsException(
                            "Not enough coins. Need " + coinsNeeded + " but have " + slot.getCoins());
                }
                slot.setCoins(slot.getCoins() - coinsNeeded);
                slot.setOrbs(slot.getOrbs() + quantity);
                break;
            }
            default:
                throw new InvalidOperationException("Invalid trade type: " + type);
        }

        saveSlotDao.save(slot);
        return saveSlotService.toFullDto(slot);
    }
}
