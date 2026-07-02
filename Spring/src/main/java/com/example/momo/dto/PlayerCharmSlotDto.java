package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PlayerCharmSlotDto {

    private Long id;
    private Long saveSlotId;
    private Integer slotIndex;
    private Long charmItemId;
    private ShopItemDto charmItem;
}
