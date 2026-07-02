package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    /** WEAPON, DEFENSE, POTION, CHARM */
    @Column(nullable = false, length = 20)
    private String category;

    @Column(length = 1000)
    private String description;

    /** Price in coins */
    @Column(nullable = false)
    private Integer priceCoin;

    /** Price in orbs (0 if not applicable) */
    @Column(nullable = false)
    private Integer priceOrb;

    /** Icon path / URL (changeable) */
    @Column(length = 500)
    private String iconImage;

    // --- Stat Modifiers ---
    @Column(nullable = false)
    private Integer attackBonus;

    @Column(nullable = false)
    private Integer defenseBonus;

    @Column(nullable = false)
    private Integer hpBonus;

    /** Healing amount for potions */
    @Column(nullable = false)
    private Integer healAmount;

    /** Special effect identifier (e.g., "PARALYZE", "EXTRA_TURN", "LIFESTEAL", etc.) */
    @Column(length = 50)
    private String specialEffect;

    /** JSON string storing special effect parameters (e.g., stack count, percentages) */
    @Column(length = 1000)
    private String effectParams;

    /** Whether this item is permanent (weapons, defense, charms) or consumable (potions) */
    @Column(nullable = false)
    private Boolean permanent;

    /** For potions: max uses per match */
    @Column(nullable = false)
    private Integer maxUsesPerMatch;

    /** Whether this item is active in the shop */
    @Column(nullable = false)
    private Boolean active;

    @PrePersist
    protected void setDefaults() {
        if (attackBonus == null) attackBonus = 0;
        if (defenseBonus == null) defenseBonus = 0;
        if (hpBonus == null) hpBonus = 0;
        if (healAmount == null) healAmount = 0;
        if (permanent == null) permanent = true;
        if (maxUsesPerMatch == null) maxUsesPerMatch = 0;
        if (active == null) active = true;
        if (priceCoin == null) priceCoin = 0;
        if (priceOrb == null) priceOrb = 0;
    }
}
