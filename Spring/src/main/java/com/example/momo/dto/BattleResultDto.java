package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class BattleResultDto {

    private Long saveSlotId;
    private Integer roomNumber;

    /** true = player won, false = player lost or fled */
    private Boolean victory;

    /** Whether this was the first time clearing this room */
    private Boolean firstClear;

    // Rewards earned
    private Integer coinsEarned;
    private Integer orbsEarned;
    private Integer orbFragmentsEarned;

    /** Greed dagger multiplier applied */
    private Double coinMultiplier;
    private Double orbChance;
}
