package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "save_slots")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SaveSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Slot number: 1, 2, or 3 */
    @Column(nullable = false)
    private Integer slotNumber;

    @Column(nullable = false, length = 50)
    private String playerName;

    /** Path / URL to player's profile image (changeable) */
    @Column(length = 500)
    private String profileImage;

    /** Current room the player has reached (1-13, 0 = just started) */
    @Column(nullable = false)
    private Integer currentRoom;

    /** Highest room cleared */
    @Column(nullable = false)
    private Integer highestRoomCleared;

    @Column(nullable = false)
    private Integer coins;

    @Column(nullable = false)
    private Integer orbs;

    @Column(nullable = false)
    private Integer orbFragments;

    // --- Base Stats ---
    @Column(nullable = false)
    private Integer baseHp;

    @Column(nullable = false)
    private Integer baseAttack;

    @Column(nullable = false)
    private Integer baseDefense;

    // --- Orb Upgrade Levels ---
    @Column(nullable = false)
    private Integer healthUpgradeLevel;

    @Column(nullable = false)
    private Integer attackUpgradeLevel;

    @Column(nullable = false)
    private Integer critRateUpgradeLevel;

    /** Player's crit rate percentage (from orb upgrades) */
    @Column(nullable = false)
    private Double playerCritRate;

    /** Currently equipped weapon item ID (nullable) */
    private Long equippedWeaponId;

    /** Currently equipped defense item ID (nullable) */
    private Long equippedDefenseId;

    /** Total playtime in seconds */
    @Column(nullable = false)
    private Long playtimeSeconds;

    /** false = Normal, true = Hard mode */
    @Column(nullable = false)
    private Boolean hardMode;

    /** Whether the player has completed all 13 rooms at least once */
    @Column(nullable = false)
    private Boolean gameCompleted;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (coins == null) coins = 0;
        if (orbs == null) orbs = 0;
        if (orbFragments == null) orbFragments = 0;
        if (currentRoom == null) currentRoom = 0;
        if (highestRoomCleared == null) highestRoomCleared = 0;
        if (baseHp == null) baseHp = 100;
        if (baseAttack == null) baseAttack = 20;
        if (baseDefense == null) baseDefense = 10;
        if (healthUpgradeLevel == null) healthUpgradeLevel = 0;
        if (attackUpgradeLevel == null) attackUpgradeLevel = 0;
        if (critRateUpgradeLevel == null) critRateUpgradeLevel = 0;
        if (playerCritRate == null) playerCritRate = 0.0;
        if (playtimeSeconds == null) playtimeSeconds = 0L;
        if (hardMode == null) hardMode = false;
        if (gameCompleted == null) gameCompleted = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
