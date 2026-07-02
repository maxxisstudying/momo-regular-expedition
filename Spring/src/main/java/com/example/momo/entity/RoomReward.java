package com.example.momo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_rewards")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoomReward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Room number (1-13) */
    @Column(nullable = false, unique = true)
    private Integer roomNumber;

    /** Coins granted on first clear */
    @Column(nullable = false)
    private Integer firstClearCoins;

    /** Orbs granted on first clear */
    @Column(nullable = false)
    private Integer firstClearOrbs;

    /** Coins granted on replay */
    @Column(nullable = false)
    private Integer replayCoins;

    /** Orb fragments granted on replay */
    @Column(nullable = false)
    private Integer replayOrbFragments;

    @PrePersist
    protected void setDefaults() {
        if (firstClearCoins == null) firstClearCoins = 0;
        if (firstClearOrbs == null) firstClearOrbs = 0;
        if (replayCoins == null) replayCoins = 0;
        if (replayOrbFragments == null) replayOrbFragments = 0;
    }
}
