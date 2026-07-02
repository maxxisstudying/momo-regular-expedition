package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ShopItemDto {

    private Long id;
    private String name;
    private String category;
    private String description;
    private Integer priceCoin;
    private Integer priceOrb;
    private String iconImage;
    private Integer attackBonus;
    private Integer defenseBonus;
    private Integer hpBonus;
    private Integer healAmount;
    private String specialEffect;
    private String effectParams;
    private Boolean permanent;
    private Integer maxUsesPerMatch;
    private Boolean active;
}
