package com.example.momo.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SaveSlotDto {

    private Long id;
    private Integer slotNumber;
    private String playerName;
    private String profileImage;
    private Integer currentRoom;
    private Integer highestRoomCleared;
    private Integer coins;
    private Integer orbs;
    private Integer orbFragments;

    private Integer baseHp;
    private Integer baseAttack;
    private Integer baseDefense;

    private Integer healthUpgradeLevel;
    private Integer attackUpgradeLevel;
    private Integer critRateUpgradeLevel;
    private Double playerCritRate;

    private Long equippedWeaponId;
    private Long equippedDefenseId;

    /** Computed total HP (base + upgrades + weapon bonuses) */
    private Integer totalHp;
    /** Computed total ATK */
    private Integer totalAttack;
    /** Computed total DEF */
    private Integer totalDefense;

    private Long playtimeSeconds;
    private Boolean hardMode;
    private Boolean gameCompleted;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<PlayerItemDto> items;
    private List<PlayerCharmSlotDto> charmSlots;
    private List<RoomClearRecordDto> roomClearRecords;

    private ShopItemDto equippedWeapon;
    private ShopItemDto equippedDefense;
}
