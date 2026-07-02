package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TradeDto {

    private Long saveSlotId;

    /** "FRAGMENTS_TO_ORB" or "COINS_TO_ORB" */
    private String tradeType;

    /** How many times to perform this trade */
    private Integer quantity;
}
