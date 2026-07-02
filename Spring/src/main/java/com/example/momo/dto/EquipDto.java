package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class EquipDto {

    private Long saveSlotId;

    /** "WEAPON" or "DEFENSE" */
    private String equipType;

    /** The shop item ID to equip (null to unequip) */
    private Long itemId;
}
