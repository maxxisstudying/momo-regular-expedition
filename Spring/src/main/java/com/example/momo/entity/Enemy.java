package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "enemies")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Enemy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    /** Room number this enemy belongs to (1-13) */
    @Column(nullable = false)
    private Integer roomNumber;

    @Column(nullable = false)
    private Integer hp;

    @Column(nullable = false)
    private Integer attack;

    @Column(nullable = false)
    private Integer defense;

    /** Chance of enemy's damage being reduced (e.g., 40 = 40%) */
    @Column(nullable = false)
    private Double reduceDamageChance;

    /** 
     * JSON array of possible damage reduction multipliers 
     * e.g., "[0.4, 0.5, 0.6, 0.7]" 
     */
    @Column(length = 500)
    private String damageReductionOptions;

    /** Enemy crit chance percentage (e.g., 8 = 8%) */
    @Column(nullable = false)
    private Double critChance;

    /** 
     * JSON array of possible crit damage multipliers 
     * e.g., "[1.02, 1.05]" 
     */
    @Column(length = 500)
    private String critDamageOptions;

    /** Enemy sprite / image path (changeable) */
    @Column(length = 500)
    private String spriteImage;

    /** Whether this enemy is active */
    @Column(nullable = false)
    private Boolean active;

    @PrePersist
    protected void setDefaults() {
        if (reduceDamageChance == null) reduceDamageChance = 0.0;
        if (critChance == null) critChance = 0.0;
        if (active == null) active = true;
    }
}
