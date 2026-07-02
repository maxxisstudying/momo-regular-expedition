package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlayerItemDto {

    private Long id;
    private Long saveSlotId;
    private Long shopItemId;
    private Integer quantity;
    private ShopItemDto shopItem;
}
