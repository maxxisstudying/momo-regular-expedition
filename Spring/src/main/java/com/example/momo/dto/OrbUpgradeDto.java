package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class OrbUpgradeDto {

    private Long saveSlotId;

    /** "HEALTH", "ATTACK", or "CRIT_RATE" */
    private String upgradeType;
}
