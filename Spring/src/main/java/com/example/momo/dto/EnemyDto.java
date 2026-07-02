package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class EnemyDto {

    private Long id;
    private String name;
    private Integer roomNumber;
    private Integer hp;
    private Integer attack;
    private Integer defense;
    private Double reduceDamageChance;
    private String damageReductionOptions;
    private Double critChance;
    private String critDamageOptions;
    private String spriteImage;
    private Boolean active;
}
