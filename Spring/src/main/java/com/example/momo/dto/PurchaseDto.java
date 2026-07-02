package com.example.momo.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class PurchaseDto {

    private Long saveSlotId;
    private Long shopItemId;
    private Integer quantity;
}
